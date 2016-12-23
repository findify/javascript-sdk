import * as assign from 'lodash/assign';
import * as every from 'lodash/every';

import { requestApi, Config as RequestApiConfig } from './utils/requestApi';

class SDK {
  private config: FindifySDK.Config;
  private requestApiConfig: RequestApiConfig;

  private makeExtendedRequest(request: Request) {
    const extendedRequest = assign({}, {
      user: this.config.user,
      log: this.config.log,
      t_client: (new Date()).getTime(),
    }, request);

    const { user } = extendedRequest;

    if (typeof user === 'undefined') {
      throw new Error('`user` param should be provided at request or at library config');
    }

    if (typeof user.uid === 'undefined') {
      throw new Error('"user.uid" param is required');
    }

    if (typeof user.sid === 'undefined') {
      throw new Error('"user.sid" param is required');
    }

    return extendedRequest;
  }

  private makeRequestApiConfig() {
    return {
      host: 'https://api-v3.findify.io',
      jsonpCallbackPrefix: 'findifyCallback',
      method: this.config.method || 'jsonp',
      key: this.config.key,
    };
  }

  public constructor(config: FindifySDK.Config) {
    if (!config || typeof config.key === 'undefined') {
      throw new Error('"key" param is required');
    }

    this.config = config;
    this.requestApiConfig = this.makeRequestApiConfig();
  }

  public autocomplete(request: FindifySDK.AutocompleteRequest) {
    if (!request || typeof request.q === 'undefined') {
      throw new Error('"q" param is required');
    }

    const extendedRequest = this.makeExtendedRequest(request);

    return requestApi('/autocomplete', extendedRequest, this.requestApiConfig);
  }

  public search(request: FindifySDK.SearchRequest) {
    if (!request || typeof request.q === 'undefined') {
      throw new Error('"q" param is required');
    }

    const { filters, sort } = request;

    if (filters && !everyKey(filters, 'name')) {
      throw new Error('"filters.name" param is required');
    }

    if (filters && !everyKey(filters, 'type')) {
      throw new Error('"filters.type" param is required');
    }

    if (sort && !everyKey(sort, 'field')) {
      throw new Error('"sort.field" param is required');
    }

    if (sort && !everyKey(sort, 'order')) {
      throw new Error('"sort.order" param is required');
    }

    const extendedRequest = this.makeExtendedRequest(request);

    return requestApi('/search', extendedRequest, this.requestApiConfig);
  }
}

function everyKey(collection, key) {
  return every(collection, (item) => typeof item[key] !== 'undefined');
}

type ExtendedRequest<Request> = Request & {
  user: FindifySDK.User,
  t_client: number,
  log?: boolean,
};

type Request = FindifySDK.AutocompleteRequest;

export default SDK;
