import * as qs from 'qs';
import * as axios from 'axios';
import * as jsonp from 'jsonp';
import * as Promise from 'bluebird';
import * as assign from 'lodash/assign';
import * as toPlainObject from 'lodash/toPlainObject';

import { resolveUrl } from './resolveUrl';
import { countBytesInString } from './countBytesInString';
import { joinParams } from './joinParams';

// retry couple of times on failure request
// test browwsers specific code in browserstack or something else

function requestApi(path: string, requestData: RequestData, config: Config) {
  const env = typeof window === 'undefined' ? 'node' : 'browser';

  if (env === 'node' && config.method === 'jsonp') {
    throw new Error('jsonp method is not allowed in node environment');
  }

  const requestDataWithKey = assign({}, requestData, { key: config.key });
  const queryStringParams = qs.stringify(requestDataWithKey);
  const url = resolveUrl(config.host, path);

  if (config.method === 'post' || countBytesInString(queryStringParams) > 4096) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'POST',
        data: requestData,
        headers: {
          'x-key': config.key,
          'Content-type': 'application/json',
        },
      }).then(({ data }) => resolve(data)).catch((err) => reject(err));
    });
  }

  if (config.method === 'jsonp') {
    return new Promise((resolve, reject) => {
      jsonp(joinParams(url, queryStringParams), {
        prefix: config.jsonpCallbackPrefix,
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

type RequestData = {
  [key: string]: any,
};

type Config = {
  key: string,
  host: string,
  method: 'post' | 'jsonp',
  jsonpCallbackPrefix?: string,
};

export {
  requestApi,
  Config,
  RequestData,
}
