import * as assign from 'lodash/assign';

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

    if (!extendedRequest.user) {
      throw new Error('`user` param should be provided at request or at library config');
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
    const extendedRequest = this.makeExtendedRequest(request);

    return requestApi('/autocomplete', extendedRequest, this.requestApiConfig);
  }
}

type ExtendedRequest<Request> = Request & {
  user: FindifySDK.User,
  t_client: number,
  log?: boolean,
};

type Request = FindifySDK.AutocompleteRequest;

export default SDK;
