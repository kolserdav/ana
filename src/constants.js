// @ts-check

const CI = process.env.CI === 'true';

/**
 * result of
 * ```
 * git ls-remote [repository]
 * ```
 */
const GIT_HEAD_REGEXP = /^[a-zA-Z0-9]+/;

module.exports = { CI, GIT_HEAD_REGEXP };
