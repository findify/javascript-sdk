import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';

import { requestApi } from './modules/requestApi';
import { requestResults } from './modules/requestResults';

class SDK {
  private config: FindifySDK.Config;

  public constructor(config: FindifySDK.Config) {
    if (!config || typeof config.key === 'undefined') {
      throw new Error('"key" param is required');
    }

    this.config = config;
  }

  public autocomplete(request: FindifySDK.AutocompleteRequest) {
    if (!request || typeof request.q === 'undefined') {
      throw new Error('"q" param is required');
    }

    return requestApi('/autocomplete', request, this.config);
  }

  public search(request: FindifySDK.SearchRequest) {
    if (!request || typeof request.q === 'undefined') {
      throw new Error('"q" param is required');
    }

    return requestResults('/search', request, this.config);
  }

  public collection(request: FindifySDK.CollectionRequest) {
    if (!request || typeof request.slot === 'undefined') {
      throw new Error('"slot" param is required');
    }

    const omittedRequest = omit(request, ['slot']);

    return requestResults(`/collection/${request.slot}`, omittedRequest, this.config);
  }

  // use describe for each type
  // test base flow with sending t_client, user etc
  // test validation by type, type => request
  // test that we will sending request to proper endpoint(and with proper body), ex. provided `generic` recommendations type, => send to generic endpoint with corresponding body(at least two tests)

  public recommendations(type: FindifySDK.RecommendationsType, request: FindifySDK.RecommendationsRequest) {

  }

  public feedback(request: FindifySDK.FeedbackRequest) {
    if (!request || typeof request.event === 'undefined') {
      throw new Error('"event" param is required');
    }

    return requestApi('/feedback', request, this.config);
  }
}

export default SDK;
