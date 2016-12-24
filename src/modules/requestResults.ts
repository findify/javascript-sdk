import * as every from 'lodash/every';

import { requestApi } from './requestApi';

function requestResults(endpoint: string, request: FindifySDK.ResultsRequest, config: FindifySDK.Config) {
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

  return requestApi(endpoint, request, config);
}

function everyKey(c, key) {
  return every(c, (item) => typeof item[key] !== 'undefined');
}

export {
  requestResults,
};
