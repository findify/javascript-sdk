import * as every from 'lodash/every';

import { requestApi } from './requestApi';

import {
  Config,
  SearchRequestBody,
  CollectionRequestBody,
} from '../types';

function requestResults(endpoint: string, requestBody: SearchRequestBody | CollectionRequestBody, config: Config) {
  const { filters, sort } = requestBody;

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

  return requestApi(endpoint, requestBody, config);
}

function everyKey(c, key) {
  return every(c, (item) => typeof item[key] !== 'undefined');
}

export {
  requestResults,
};
