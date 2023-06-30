#! /usr/bin/env node

// @ts-check
const { log } = require('../packages/server/dist/utils/lib');
const { spawnCommand, needSplitNext, gitHeadRemote } = require('../src/lib');
const { repository, version } = require('../package.json');
const { GIT_HEAD_REGEXP, BRANCH_NAME_DEFAULT, BRANCH } = require('../src/constants');

const value = typeof Infinity;
/**
 * @typedef {'help' | 'branch' | 'exec' | 'packages'} ArgName
 * @typedef {{name: ArgName; aliases: string[]; value: typeof value; data: any; description: string; default?: any}} Args
 */

/**
 * @param {number | null} code
 */
const exit = (code) => {
  log(code === 0 ? 'info' : 'error', 'Process exit with code', code, true);
  process.exit(code ? code : -1);
};

/**
 * @returns {Args[]}
 */
const prepareArgs = () => {
  const { argv: _argv } = process;
  const argv = _argv
    .map((item) => {
      if (/=/.test(item)) {
        return item.split('=');
      }
      return item;
    })
    .flat();
  /**
   * @type {Args[]}
   */
  const args = [
    {
      name: 'help',
      aliases: ['-h', '--help'],
      value: 'boolean',
      description: 'Open help page',
      data: null,
    },
    {
      name: 'branch',
      aliases: ['-b', '--branch'],
      value: 'string',
      description: 'Branch name <env.BRANCH>',
      default: `: [${BRANCH_NAME_DEFAULT}]`,
      data: BRANCH_NAME_DEFAULT,
    },
    {
      name: 'exec',
      aliases: ['-e', '--exec'],
      value: 'object',
      description: 'Bash script file',
      data: null,
    },
    {
      name: 'packages',
      aliases: ['-p', '--packages'],
      value: 'object',
      description: 'Split scripts by changed packages',
      data: null,
    },
  ];

  /**
   * @type {Args[]}
   */
  const _args = [];
  argv.forEach((item, index) => {
    /**
     * @type {Args[]}
     */
    args.every((_item) => {
      if (!/^-{1,2}/.test(item)) {
        return false;
      }
      if (_item.aliases.indexOf(item) !== -1) {
        const argItem = { ..._item };

        const shift = needSplitNext({ argv, index });

        const data = argv[index + shift] || _item.data || '';

        argItem.data = data;
        _args.push(argItem);
        return false;
      }
      return true;
    });
  });
  return _args;
};

(async () => {
  log('info', 'Start check git script', undefined);
  const args = prepareArgs();

  /**
   * @type {Record<ArgName, any>}
   */
  const props = {
    branch: BRANCH_NAME_DEFAULT,
    help: false,
    exec: [],
    packages: [],
  };
  args.forEach((item) => {
    switch (item.name) {
      case 'help':
        props.help = `
Check git: ${version}:

Check and update code from repository.

Usage:
      git-check [options]

Options:
${args
  .map(
    (__item) =>
      `${__item.aliases.join(' | ')} <${__item.value}> ${__item.default || ''} : ${
        __item.description
      }`
  )
  .join('\n')}
`;
        break;
        console.log(props.help);
        return exit(0);
        break;
      case 'branch':
        props.branch = item.data;

        break;
      case 'exec':
        props.exec = item.data.split(',');
        break;
      case 'packages':
        props.packages = item.data.split(',');
        break;
    }
  });

  if (BRANCH) {
    props.branch = BRANCH;
    log('info', 'Used env.BRANCH', BRANCH);
  }

  log(
    'info',
    'Selected options:\n',
    args.map((item) => `\r${item.name}: ${item.data}`).join('\n'),
    true
  );

  const { branch, exec, packages } = props;

  if (exec.length === 0 || packages.length === 0) {
    log('error', 'Packages and exec options is required ', { packages, exec });
    return exit(1);
  }
  if (packages.length !== exec.length) {
    log('error', 'Packages length and exec length are not same ', { packages, exec });
    return exit(1);
  }

  const local = await spawnCommand('git', ['rev-parse', 'HEAD'], {
    match: GIT_HEAD_REGEXP,
  });
  if (local.code !== 0) {
    log('error', 'Command "' + local.commandDesc + '" failed ', { local, quiet: true });
    return exit(1);
  }
  const remote = await spawnCommand('git', ['ls-remote', repository], {
    match: GIT_HEAD_REGEXP,
    prepareData: gitHeadRemote(branch),
  });

  if (remote.code !== 0) {
    log('error', 'Command "' + local.commandDesc + '" failed ', { local });
    return exit(1);
  }

  if (remote.data === local.data) {
    log('info', 'Repository commits are match', { local: local.data, remote: remote.data }, true);
    return exit(0);
  }
  log(
    'info',
    'Repository commits are not match',
    {
      props,
      local: local.data,
      remote: remote.data,
    },
    true
  );

  /**
   * @type {string[]}
   */
  const _packages = packages;

  /**
   * @type {string[]}
   */
  const _exec = exec;

  const diff = await spawnCommand('git', ['pull', 'origin', branch], {});
  for (let i = 0; _packages[i]; i++) {
    const item = _packages[i];

    /**
     * @type {any}
     */
    const _diff = diff.data;
    if (!_diff) {
      log('warn', 'Diffs are not found', { _diff });
      return exit(1);
    }

    let checkPackage = false;
    if (new RegExp(item || '').test(_diff)) {
      checkPackage = true;
    }

    let needInstall = false;
    if (new RegExp(`${item?.replace(/\/$/, '')}/package.json` || '').test(_diff)) {
      needInstall = true;
    }

    if (!checkPackage) {
      log('info', 'Package ' + item + ' is not changed, skipping...', true);
      continue;
    }
    const { env } = process;
    env.NEED_INSTALL = needInstall ? '1' : '0';
    const execI = _exec[i];
    const command = execI ? `${/^\//.test(execI) ? '' : './'}${execI.replace(/^\.\//, '')}` : 'sh';
    const result = await spawnCommand(command, [], { env });
    if (result.code !== 0) {
      return exit(result.code);
    }
  }
  return exit(0);
})();
