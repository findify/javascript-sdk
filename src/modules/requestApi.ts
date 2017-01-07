import * as qs from 'qs';
import * as axios from 'axios';
import * as jsonp from 'jsonp';
import * as Promise from 'bluebird';
import * as assign from 'lodash/assign';
import * as toPlainObject from 'lodash/toPlainObject';

import { resolveUrl } from '../utils/resolveUrl';
import { countBytesInString } from '../utils/countBytesInString';
import { joinParams } from '../utils/joinParams';

import {
  Config,
  User,
  RequestBody,
} from '../types';

// retry couple of times on failure request
// test browwsers specific code in browserstack or something else
// we should reject same errors not depending on request type

// implement error handling. lib should return object with Error type, { message: string }
// request param could be optional?
function requestApi(endpoint: string, requestBody: RequestBody, config: Config) {
  const settings = makeSettings(config);

  const extendedRequest = extendRequest(requestBody, config);
  const extendedRequestWithKey = assign({}, extendedRequest, { key: settings.key });
  const queryStringParams = qs.stringify(extendedRequestWithKey);
  const url = resolveUrl(settings.host, endpoint);

  if (settings.method === 'post' || countBytesInString(queryStringParams) > 4096) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'POST',
        data: extendedRequest,
        headers: {
          'x-key': settings.key,
          'Content-type': 'application/json',
        },
      }).then(({ data }) => resolve(data)).catch((err) => reject(err));
    });
  }

  if (settings.method === 'jsonp') {
    return new Promise((resolve, reject) => {
      jsonp(joinParams(url, queryStringParams), {
        prefix: settings.jsonpCallbackPrefix,
        timeout: 1000,
      }, (err: Error, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(toPlainObject(response));
        }
      });
    });
  }
}

function extendRequest(requestBody: RequestBody, config: Config): ExtendedRequestBody<RequestBody> {
  const extendedRequest = assign({}, {
    user: config.user,
    log: config.log,
  }, requestBody, {
    t_client: (new Date()).getTime(),
  });

  const { user } = extendedRequest;

  if (typeof user === 'undefined') {
    throw new Error('`user` param should be provided either at request or at library config');
  }

  if (typeof user.uid === 'undefined') {
    throw new Error('"user.uid" param is required');
  }

  if (typeof user.sid === 'undefined') {
    throw new Error('"user.sid" param is required');
  }

  return extendedRequest as any;
}

function makeSettings(config: Config): Settings {
  const jsEnv = typeof window === 'undefined' ? 'node' : 'browser';

  if (jsEnv === 'node' && config.method === 'jsonp') {
    throw new Error('jsonp method is not allowed in node environment');
  }

  return {
    host: 'https://api-v3.findify.io',
    jsonpCallbackPrefix: 'findifyCallback',
    method: config.method || (jsEnv === 'browser' ? 'jsonp' : 'post'),
    key: config.key,
  };
}

type ExtendedRequestBody<R> = R & {
  user: User,
  t_client: number,
  log?: boolean,
};

type Settings = {
  key: string,
  host: string,
  method: 'post' | 'jsonp',
  jsonpCallbackPrefix?: string,
};

export {
  requestApi,
  makeSettings,
  extendRequest,
}
