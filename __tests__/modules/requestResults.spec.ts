import * as expect from 'expect';

import { requestResults } from '../../src/modules/requestResults';

describe('requestResults', () => {
  const config = {
    key: 'testApiKey',
    user: {
      uid: 'testUserId',
      sid: 'testSessionId',
    },
  };

  it('should throw validation Error if "filters.name" param is not provided', () => {
    expect(() => requestResults('/test', {
      q: 'test',
      filters: [{
        type: 'testType',
      }],
    }, config)).toThrow(/"filters.name" param is required/);
  });

  it('should throw validation Error if "filters.type" param is not provided', () => {
    expect(() => requestResults('/test', {
      q: 'test',
      filters: [{
        name: 'testFilter',
      }],
    }, config)).toThrow(/"filters.type" param is required/);
  });

  it('should throw validation Error if "sort.field" param is not provided', () => {
    expect(() => requestResults('/test', {
      q: 'test',
      sort: [{
        order: 'testOrder',
      }],
    }, config)).toThrow(/"sort.field" param is required/);
  });

  it('should throw validation Error if "sort.order" param is not provided', () => {
    expect(() => requestResults('/test', {
      q: 'test',
      sort: [{
        field: 'testField',
      }],
    }, config)).toThrow(/"sort.order" param is required/);
  });
});
