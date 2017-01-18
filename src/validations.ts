import * as has from 'lodash/has';
import {
  Config,
  RecommendationsType,
  FeedbackType,
  AutocompleteRequest,
  SearchRequest,
  CollectionRequest,
  RecommendationsRequest,
  FeedbackRequest,
} from './types';

function validateInitParams(config: Config) {
  if (!has(config, 'key')) {
    throw new Error('"key" param is required');
  }

  if (typeof config.key !== 'string') {
    throw new Error('"key" param should be a string');
  }

  if (typeof config.method !== 'undefined' && (config.method !== 'post' && config.method !== 'jsonp')) {
    throw new Error('"method" param should be either "post" or "jsonp"');
  }

  if (typeof config.log !== 'undefined' && typeof config.log !== 'boolean') {
    throw new Error('"log" param should be "boolean" type');
  }
}

function validateAutocompleteParams(request: AutocompleteRequest) {
  if (!has(request, 'q')) {
    throw new Error('"q" param is required');
  }
}

function validateSearchParams(request: SearchRequest) {
  if (!has(request, 'q')) {
    throw new Error('"q" param is required');
  }
}

function validateCollectionParams(request: CollectionRequest) {
  if (!has(request, 'slot')) {
    throw new Error('"slot" param is required');
  }
}

function validateRecommendationsParams(type: RecommendationsType, request: RecommendationsRequest) {
  if (type === 'predefined' && !has(request, 'slot')) {
    throw new Error('"slot" param is required');
  }

  if ((type === 'viewed' || type === 'bought') && !has(request, 'item_id')) {
    throw new Error('"item_id" param is required');
  }
}

function validateFeedbackParams(type: FeedbackType, request) {
  if ([
    'click-suggestion',
    'click-item',
    'redirect',
    'purchase',
    'add-to-cart',
    'update-cart',
    'view-page',
  ].indexOf(type) === -1) {
    throw new Error('Event not found');
  }

  if (type === 'click-suggestion') {
    if (!has(request, 'rid')) {
      throw new Error('"rid" param is required');
    }

    if (!has(request, 'suggestion')) {
      throw new Error('"suggestion" param is required');
    }
  }

  if (type === 'click-item' && !has(request, 'item_id')) {
    throw new Error('"item_id" param is required');
  }

  if (type === 'redirect') {
    if (!has(request, 'rid')) {
      throw new Error('"rid" param is required');
    }

    if (!has(request, 'suggestion')) {
      throw new Error('"suggestion" param is required');
    }
  }

  if (type === 'purchase') {
    if (!has(request, 'order_id')) {
      throw new Error('"order_id" param is required');
    }

    if (!has(request, 'currency')) {
      throw new Error('"currency" param is required');
    }

    if (!has(request, 'revenue')) {
      throw new Error('"revenue" param is required');
    }

    if (!has(request, 'line_items')) {
      throw new Error('"line_items" param is required');
    }

    if (!(request).line_items.every((item) => !! item.item_id)) {
      throw new Error('"line_items[].item_id" param is required');
    }

    if (!(request).line_items.every((item) => !! item.unit_price)) {
      throw new Error('"line_items[].unit_price" param is required');
    }

    if (!(request).line_items.every((item) => !! item.quantity)) {
      throw new Error('"line_items[].quantity" param is required');
    }
  }

  if (type === 'add-to-cart' && !has(request, 'item_id')) {
    throw new Error('"item_id" param is required');
  }

  if (type === 'update-cart') {
    if (!has(request, 'line_items')) {
      throw new Error('"line_items" param is required');
    }

    if (!(request).line_items.every((item) => !! item.item_id)) {
      throw new Error('"line_items[].item_id" param is required');
    }

    if (!(request).line_items.every((item) => !! item.unit_price)) {
      throw new Error('"line_items[].unit_price" param is required');
    }

    if (!(request).line_items.every((item) => !! item.quantity)) {
      throw new Error('"line_items[].quantity" param is required');
    }
  }

  if (type === 'view-page') {
    if (!has(request, 'url')) {
      throw new Error('"url" param is required');
    }

    if (!has(request, 'ref')) {
      throw new Error('"ref" param is required');
    }

    if (!has(request, 'width')) {
      throw new Error('"width" param is required');
    }

    if (!has(request, 'height')) {
      throw new Error('"height" param is required');
    }
  }
}

export {
  validateInitParams,
  validateAutocompleteParams,
  validateSearchParams,
  validateCollectionParams,
  validateRecommendationsParams,
  validateFeedbackParams,
}
