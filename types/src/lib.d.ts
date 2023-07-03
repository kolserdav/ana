/**
 *
 * @param {{url: string}} param0
 */
export function getPage({ url }: {
    url: string;
}): Promise<{
    page: puppeteer.Page | undefined;
    browser: puppeteer.Browser;
}>;
/**
 *
 * @returns {Promise<void>}
 */
export function startServer(): Promise<void>;
/**
 *
 * @param {string} executable
 * @param  {string[]} args
 * @param {{head?: boolean; match?: RegExp; env?: typeof process.env; noWait?: boolean} | undefined} options
 * @returns
 */
export function spawnCommand(executable: string, args: string[], options: {
    head?: boolean;
    match?: RegExp;
    env?: typeof process.env;
    noWait?: boolean;
} | undefined): Promise<{
    data: string;
    code: any;
}>;
/**
 *
 * @param {{argv: typeof process.argv; index: number}} param0
 * @param {string} symbol
 * @returns {number}
 */
export function needSplitNext({ argv, index }: {
    argv: typeof process.argv;
    index: number;
}, symbol?: string): number;
import puppeteer = require("puppeteer");
declare const env: any;
export {};
//# sourceMappingURL=lib.d.ts.map