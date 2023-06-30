// @ts-check
const { log } = require('../packages/server/dist/utils/lib');
const { spawnCommand, needSplitNext, gitHeadRemote } = require('../src/lib');
const { repository, version } = require('../package.json');
const {
  GIT_HEAD_REGEXP,
  BRANCH_NAME_DEFAULT,
  EXECUTABLE_PATH_DEFAULT,
} = require('../src/constants');

const value = typeof Infinity;
/**
 * @typedef {'help' | 'branch' | 'exec'} ArgName
 * @typedef {{name: ArgName; aliases: string[]; value: typeof value; data: any; description: string; default?: any}} Args
 */

/**
 * @param {number | null} code
 */
const exit = (code) => {
  log(code === 0 ? 'info' : 'error', 'Process exit with code', code);
  process.exit(code ? code : -1);
};

/**
 * @returns {Args[]}
 */
const prepareArgs = () => {
  const { argv } = process;
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
      description: 'Branch name',
      default: `: [${BRANCH_NAME_DEFAULT}]`,
      data: BRANCH_NAME_DEFAULT,
    },
    {
      name: 'exec',
      aliases: ['-e', '--exec'],
      value: 'string',
      description: 'Bash script file',
      default: `: [${EXECUTABLE_PATH_DEFAULT}]`,
      data: EXECUTABLE_PATH_DEFAULT,
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

        /**
         * Casting types
         * @type {any}
         */
        let data = argv[index + shift] || _item.data;
        switch (_item.value) {
          case 'number':
            data = parseInt(data);
            break;
          case 'boolean':
            data = true;
            break;
          case 'string':
            data = data;
            break;
          default:
            log('warn', 'Default case of data type', { data, _item, type: typeof _item.value });
        }

        // Prepare data
        switch (_item.name) {
          case 'help':
            data = `
Check git: ${version}:

Check and update code from repository.

Usage:
      git-check [options]

Options:
${args
  .map((__item) => `${__item.aliases.join(' | ')} ${__item.default || ''} : ${__item.description}`)
  .join('\n')}
`;
            break;
        }

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
    branch: 'master',
    help: false,
    exec: EXECUTABLE_PATH_DEFAULT,
  };
  args.forEach((item) => {
    switch (item.name) {
      case 'help':
        console.log(item.data);
        process.exit(0);
        break;
      case 'branch':
        props.branch = item.data;
        break;
      case 'exec':
        props.exec = item.data;
    }
  });

  log('info', 'Selected options:\n', args.map((item) => `\r${item.name}: ${item.data}`).join('\n'));

  const { branch, exec } = props;

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

  if (remote.data !== local.data) {
    log('info', 'Repository commits are match', { local: local.data, remote: remote.data });
    return exit(0);
  }
  log('info', 'Repository commits are not match', { local: local.data, remote: remote.data });

  const result = await spawnCommand('sh', [exec], { env: process.env });
  if (result.code !== 0) {
    return exit(result.code);
  }
  return exit(0);
})();
