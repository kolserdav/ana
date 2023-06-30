// @ts-check

const CI = process.env.CI === 'true';

/**
 * result of
 * ```
 * git ls-remote [repository]
 * ```
 */
const GIT_HEAD_REGEXP = /^[a-zA-Z0-9]+/;

const BRANCH_NAME_DEFAULT = 'master';
const EXECUTABLE_PATH_DEFAULT = './scripts/sh/no-script.sh';

module.exports = { CI, GIT_HEAD_REGEXP, EXECUTABLE_PATH_DEFAULT, BRANCH_NAME_DEFAULT };
