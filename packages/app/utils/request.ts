import { Page, Prisma } from '@prisma/client';
import {
  Api,
  LOCALE_DEFAULT,
  LANGUAGE_HEADER,
  Locale,
  Result,
  USER_ID_HEADER,
  SendMessageArgs,
  MessageType,
  TIMEOUT_HEADER,
  AUTHORIZATION_HEADER,
  APPLICATION_JSON,
  FileDeleteBody,
  ProjectCreateBody,
} from '../types/interfaces';
import { SERVER } from './constants';
import { CookieName, getCookie } from './cookies';
import { log } from './lib';

class Request {
  protocol: string;

  constructor() {
    this.protocol = `${typeof window !== 'undefined' ? window.location.protocol : 'http:'}//`;
  }

  // eslint-disable-next-line class-methods-use-this
  private async send({
    body: _body,
    url,
    id,
    locale,
    method,
    contentType = APPLICATION_JSON,
  }: {
    url: string;
    id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    locale?: string;
    contentType?: string | null;
    method: 'GET' | 'POST' | 'UPDATE' | 'DELETE';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    return new Promise((resolve) => {
      log('info', 'Send request', { method, url });
      const headers: RequestInit['headers'] = {
        [LANGUAGE_HEADER]: getCookie(CookieName.lang) || locale || LOCALE_DEFAULT,
        [USER_ID_HEADER]: id || getCookie(CookieName._uuid) || '',
        [AUTHORIZATION_HEADER]: getCookie(CookieName._utoken) || '',
        [TIMEOUT_HEADER]: new Date().getTime().toString(),
      };
      if (contentType !== null) {
        headers['Content-Type'] = contentType || APPLICATION_JSON;
      }
      const body = _body
        ? contentType === APPLICATION_JSON
          ? JSON.stringify(_body)
          : _body
        : undefined;
      fetch(`${SERVER}${url}`, {
        body,
        method,
        headers,
      })
        .then((d) => {
          resolve(d.json());
        })
        .catch((err) => {
          log('error', 'Request error', err);
          resolve({
            status: 'error',
            message: 'Internet error',
            code: 503,
            data: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as Result<any>);
        });
    });
  }

  public async test(id: string): Promise<SendMessageArgs<MessageType.TEST>> {
    return this.send({ url: Api.testV1, method: 'GET', id });
  }

  public async getLocale<T extends keyof Locale['app']>({
    field,
    locale,
  }: {
    field: T;
    locale: string | undefined;
  }): Promise<Result<Locale['app'][T]>> {
    return this.send({ url: `${Api.getLocaleV1}?field=${field}`, locale, method: 'GET' });
  }

  public async getUser(): Promise<
    SendMessageArgs<MessageType.SET_USER_FIND_FIRST> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({ url: Api.getUserFindFirst, method: 'GET' });
  }

  public async pageFindMany<T extends Prisma.PageFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.PageFindManyArgs>
  ): Promise<
    Prisma.CheckSelect<T, Result<Array<Page>>, Promise<Result<Array<Prisma.PageGetPayload<T>>>>>
  > {
    return this.send({ url: Api.postPageFindManyV1, method: 'POST', body: args });
  }

  public async fileUpload(
    files: FormData
  ): Promise<
    SendMessageArgs<MessageType.SET_FILE_UPLOAD> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.postFileUpload,
      method: 'POST',
      body: files,
      contentType: null,
    });
  }

  public async fileFindMany(): Promise<
    SendMessageArgs<MessageType.SET_FILE_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.getFileFindMany,
      method: 'GET',
    });
  }

  public async fileDelete(
    body: FileDeleteBody
  ): Promise<
    SendMessageArgs<MessageType.SET_FILE_DELETE> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.deleteFileDelete,
      method: 'DELETE',
      body,
    });
  }

  public async categoryFindMany(): Promise<
    SendMessageArgs<MessageType.SET_CATEGORY_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.categoryFindMany,
      method: 'GET',
    });
  }

  public async projectCreate(
    body: ProjectCreateBody
  ): Promise<
    SendMessageArgs<MessageType.SET_PROJECT_CREATE> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.projectCreate,
      method: 'POST',
      body,
    });
  }

  public async projectFindMany(): Promise<
    SendMessageArgs<MessageType.SET_PROJECT_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
  > {
    return this.send({
      url: Api.projectFindMany,
      method: 'GET',
    });
  }
}

export default Request;
