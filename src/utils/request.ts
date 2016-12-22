import * as qs from 'qs';
import * as axios from 'axios';
import * as jsonp from 'jsonp';
import * as Promise from 'bluebird';

import assign = require('lodash/assign');
import toPlainObject = require('lodash/toPlainObject');

import { resolveUrl } from './resolveUrl';
import { countBytesInString } from './countBytesInString';
import { joinParams } from './joinParams';

// retry couple of times on failure request
// test browwsers specific code in browserstack or something else

function request(path: string, requestData: RequestData, config: Config) {
  const env = typeof window === 'undefined' ? 'node' : 'browser';

  const defaultConfig = {
    method: env === 'node' ? 'post' : 'jsonp',
  };

  const s = assign({}, defaultConfig, config);

  const requestDataWithKey = assign({}, requestData, { key: s.apiKey });
  const queryStringParams = qs.stringify(requestDataWithKey);
  const url = resolveUrl(s.host, path);

  if (env === 'node' && config.method === 'jsonp') {
    throw new Error('jsonp method is not allowed in node environment');
  }

  if (s.method === 'post' || countBytesInString(queryStringParams) > 4096) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'POST',
        data: requestData,
        headers: {
          'x-key': s.apiKey,
          'Content-type': 'application/json',
        },
      }).then(({ data }) => resolve(data)).catch((err) => reject(err));
    });
  }

  if (s.method === 'jsonp') {
    return new Promise((resolve, reject) => {
      jsonp(joinParams(url, queryStringParams), {
        prefix: s.jsonpCallbackPrefix,
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
  apiKey: string,
  host: string,
  method?: 'post' | 'jsonp',
  jsonpCallbackPrefix?: string,
};

export {
  request,
  Config,
  RequestData,
}
