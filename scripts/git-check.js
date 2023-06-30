// @ts-check
const { log } = require('../packages/server/dist/utils/lib');
const { spawnCommand, needSplitNext } = require('../src/lib');
const { repository, version } = require('../package.json');
const { GIT_HEAD_REGEXP } = require('../src/constants');

const value = typeof Infinity;
/**
 * @typedef {'help' | 'quiet' | 'branch'} ArgName
 * @typedef {{name: ArgName; aliases: string[]; value: typeof value; data: any; description: string; default?: any}} Args
 */

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
      name: 'quiet',
      aliases: ['-q', '--quiet'],
      value: 'boolean',
      description: 'Hide aditional logs',
      data: null,
    },
    {
      name: 'branch',
      aliases: ['-b', '--branch'],
      value: 'string',
      description: 'Branch name',
      default: ': [master]',
      data: 'master',
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
         * @type {any}
         */
        let data = '';
        switch (_item.value) {
          case 'number':
            data = parseInt(data);
            break;
          case 'boolean':
            data = true;
            break;
          default:
            data = argv[index + shift] || _item.data;
        }

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
  const args = prepareArgs();

  /**
   * @type {Record<ArgName, any>}
   */
  const props = {
    quiet: false,
    branch: 'master',
    help: false,
  };
  args.forEach((item) => {
    switch (item.name) {
      case 'help':
        console.log(item.data);
        process.exit(0);
        break;
      case 'quiet':
        props.quiet = true;
        break;
      case 'branch':
        props.branch = item.data;
    }
  });

  const { quiet } = props;

  const head = await spawnCommand('git', ['rev-parse', 'HEAD'], { quiet });
  if (head.code !== 0) {
    log('error', 'Command "' + head.commandDesc + '" failed ', { head, quiet });
    return;
  }
  const remote = await spawnCommand('git', ['ls-remote', repository], {
    match: GIT_HEAD_REGEXP,
    quiet,
  });
  console.log(remote.data, head.data);
  if (remote.code !== 0) {
    log('error', 'Command "' + head.commandDesc + '" failed ', { head, quiet });
    return;
  }
})();
