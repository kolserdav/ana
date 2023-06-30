// @ts-check

const CI = process.env.CI === 'true';

const BRANCH = process.env.BRANCH;

/**
 * result of
 * ```
 * git ls-remote [repository]
 * ```
 */
const GIT_HEAD_REGEXP = /^[a-zA-Z0-9]+/;

const BRANCH_NAME_DEFAULT = 'master';

module.exports = {
  CI,
  GIT_HEAD_REGEXP,
  BRANCH_NAME_DEFAULT,
  BRANCH,
};
