import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import { SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT } from './constants';
import { EmailType, SendEmailParams } from '../types';
import { LOCALE_DEFAULT } from '../types/interfaces';
import { log } from './lib';

function getTextOfEmail(html: string): string {
  return htmlToText(html, {
    wordwrap: 130,
  });
}

function replaceVariables<T extends EmailType>(
  text: string,
  params: SendEmailParams<T>['data']
): string {
  let html = text;
  const _params: Partial<SendEmailParams<T>['data']> = { ...params };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keys: any[] = Object.keys(_params);
  for (let i = 0; keys[i]; i++) {
    const key: keyof Partial<SendEmailParams<T>['data']> = keys[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html = html.replace(new RegExp(`{${key as string}}`, 'g'), (params[key] as any) || 'undefined');
  }
  return html;
}

export async function sendEmail<T extends EmailType>(params: SendEmailParams<T>): Promise<1 | 0> {
  const { email, type, locale, subject, from } = params;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    from,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  let html = '';
  const workDir = process.cwd();
  const pathPrefix = './email';
  try {
    html = fs
      .readFileSync(path.resolve(workDir, `${pathPrefix}/${locale}/${type}.html`))
      .toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    //
  }
  if (!html) {
    try {
      html = fs
        .readFileSync(path.resolve(workDir, `${pathPrefix}/${LOCALE_DEFAULT}/${type}.html`))
        .toString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      log('error', 'Error read email', { email, type, locale, err });
      return 1;
    }
  }
  html = replaceVariables(html, params.data);
  const text = getTextOfEmail(html);
  return new Promise((resolve) => {
    const options = {
      from: SMTP_EMAIL,
      to: email,
      subject,
      text,
      html,
    };
    const info = transporter.sendMail(options);
    info
      .then(() => {
        resolve(0);
      })
      .catch((err: Error) => {
        log('error', 'Error send email to client', { options, err });
        resolve(1);
      });
  });
}
