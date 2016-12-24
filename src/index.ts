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

    // make separation between public api types(index.d.ts) and internal types(types.d.ts)
    // create SearchRequestBody etc internal types.
    // use internal types in index.d.ts

    // or use `as` instead
    const omittedRequest = omit(request, ['slot']);

    return requestResults(`/collection/${request.slot}`, omittedRequest, this.config);
  }

  // test validation by type, type => request
  // test that we will sending request to proper endpoint(and with proper body), ex. provided `generic` recommendations type, => send to generic endpoint with corresponding body(at least two tests)

  public recommendations(type: FindifySDK.RecommendationsType, request?: FindifySDK.RecommendationsRequest) {
    type ViewedOrBought = FindifySDK.ViewedRecommendationsRequest | FindifySDK.BoughtRecommendationsRequest;

    const slot = request ? (request as FindifySDK.GenericRecommendationsRequest).slot : undefined;
    const item_id = request ? (request as ViewedOrBought).item_id : undefined;

    if (type === 'generic' && (!request || typeof slot === 'undefined')) {
      throw new Error('"slot" param is required');
    }

    if ((type === 'viewed' || type === 'bought') && (!request || typeof item_id === 'undefined')) {
      throw new Error('"item_id" param is required');
    }

    if (type === 'generic') {
      const omittedRequest = omit(request, ['slot']);
      return requestApi(`/recommend/${slot}`, omittedRequest, this.config);
    }

    if (type === 'viewed') {
      const omittedRequest = omit(request, ['item_id']);
      return requestApi(`/recommend/items/${item_id}/viewed/viewed`, omittedRequest, this.config);
    }

    if (type === 'bought') {
      const omittedRequest = omit(request, ['item_id']);
      return requestApi(`/recommend/items/${item_id}/viewed/bought`, omittedRequest, this.config);
    }

    if (type === 'featured') {
      return requestApi('/recommend/items/featured', {}, this.config);
    }

    if (type === 'newest') {
      return requestApi('/recommend/items/newest', request, this.config);
    }

    if (type === 'trending') {
      return requestApi('/recommend/items/trending', request, this.config);
    }

    if (type === 'latest') {
      return requestApi('/recommend/items/latest', request, this.config);
    }
  }

  public feedback(request: FindifySDK.FeedbackRequest) {
    if (!request || typeof request.event === 'undefined') {
      throw new Error('"event" param is required');
    }

    return requestApi('/feedback', request, this.config);
  }
}

export default SDK;
