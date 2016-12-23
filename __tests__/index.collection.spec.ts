import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';

import {
  jsonpRequestMethodCase,
  jsonpByDefaultRequestMethodCase,
  postRequestMethodCase,
  userParamValidationCase,
  userParamRequestBodyAtConfigurationCase,
  userParamRequestBodyAtRequestCase,
  timestampAddingCase,
  logConfigParamCase,
  keyParamsInHeadersCase,
  jsonpCallbackPrefixCase,
  apiHostnameCase,
  uidParamExistanceAtConfigurationCase,
  uidParamExistanceAtRequestCase,
  sidParamExistanceAtConfigurationCase,
  sidParamExistanceAtRequestCase,
} from './generic-helper';

import {
  filterNameParamExistanceCase,
  filterTypeParamExistanceCase,
  sortFieldParamExistanceCase,
  sortOrderParamExistanceCase,
} from './results-helper';

import FindifySDK from '../src/index';

const key = 'testApiKey';
const user = {
  uid: 'testUserId',
  sid: 'testSessionId',
};

const makeSearch = (sdk) => {
  sdk.collection({
    slot: 'test',
  });
};

const makeSearchWithUser = (sdk) => {
  sdk.collection({
    slot: 'test',
    user,
  });
};

const makeSearchWithSid = (sdk) => {
  (sdk as any).collection({
    slot: 'test',
    user: {
      sid: 'testSessionId',
    },
  });
};

const makeSearchWithUid = (sdk) => {
  (sdk as any).collection({
    slot: 'test',
    user: {
      uid: 'testUserId',
    },
  });
};

describe('collection', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  it('should use jsonp by default if "method" is not provided at config', jsonpByDefaultRequestMethodCase(makeSearch));
  it('should use jsonp if { method: "jsonp" } is provided', jsonpRequestMethodCase(makeSearch));
  it('should use POST if { method: "post" } is provided', postRequestMethodCase(makeSearch));
  it('should throw an Error if "user" param is not provided neither at configuration nor in request', userParamValidationCase(makeSearch));
  it('should add "user" param to request body if it`s provided at sdk initialization', userParamRequestBodyAtConfigurationCase(makeSearch));
  it('should add "t_client" param to request body', timestampAddingCase(makeSearch));
  it('should add "log" param to request body if it`s provided at sdk initialization', logConfigParamCase(makeSearch));
  it('should provide "key" param to headers', keyParamsInHeadersCase(key, makeSearch));
  it('should add jsonp callback prefix as "findifyCallback"', jsonpCallbackPrefixCase(makeSearch));
  it('should send requests to "https://api-v3.findify.io"', apiHostnameCase(makeSearch));
  it('should add "user" param to request body if it`s provided as a request method param', userParamRequestBodyAtRequestCase(user, makeSearchWithUser));
  it('should throw validation Error if "user.uid" param is not provided at library configuration', uidParamExistanceAtConfigurationCase(makeSearch));
  it('should throw validation Error if "user.sid" param is not provided at library configuration', sidParamExistanceAtConfigurationCase(makeSearch));
  it('should throw validation Error if "user.uid" param is not provided at request', uidParamExistanceAtRequestCase(makeSearchWithSid));
  it('should throw validation Error if "user.sid" param is not provided at request', sidParamExistanceAtRequestCase(makeSearchWithUid));

  it('should add passed request params to request body', (done) => {
    const request = {
      filters: [{
        name: 'testFilter',
        type: 'testType',
      }],
      sort: [{
        field: 'testField',
        order: 'asc',
      }],
      offset: 10,
      limit: 15,
    };

    fauxJax.on('request', (req) => {
      const requestBody = omit(JSON.parse(req.requestBody), ['t_client']);

      expect(requestBody).toEqual(assign({}, {
        user,
      }, request));

      done();
    });

    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    sdk.collection(assign({}, request, {
      slot: 'test',
    }));
  });

  it('should send request to /collection endpoint', (done) => {
    fauxJax.on('request', (req) => {
      expect(req.requestURL.indexOf('/collection') > -1).toBe(true);
      done();
    });

    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    sdk.collection({
      slot: 'test',
    });
  });

  it('should send collection "slot" param in url', (done) => {
    fauxJax.on('request', (req) => {
      expect(req.requestURL.indexOf('/collection/test_slot') > -1).toBe(true);
      done();
    });

    const sdk = new FindifySDK({
      key,
      user,
      method: 'post',
    });

    sdk.collection({
      slot: 'test_slot',
    });
  });

  it('should throw validation Error if "slot" param is not provided', () => {
    const sdk = new FindifySDK({
      key,
      method: 'post',
      user: {
        uid: 'testUserId',
        sid: 'testSessionId',
      },
    });

    const errorRegex = /"slot" param is required/;

    expect(() => (sdk as any).collection()).toThrow(errorRegex);
    expect(() => (sdk as any).collection({})).toThrow(errorRegex);
  });

  it('should throw validation Error if "filters.name" param is not provided', filterNameParamExistanceCase((sdk) => {
    sdk.collection({
      slot: 'test',
      filters: [{
        type: 'testType',
      }],
    });
  }));

  it('should throw validation Error if "filters.type" param is not provided', filterTypeParamExistanceCase((sdk) => {
    sdk.collection({
      slot: 'test',
      filters: [{
        name: 'testFilter',
      }],
    });
  }));

  it('should throw validation Error if "sort.field" param is not provided', sortFieldParamExistanceCase((sdk) => {
    sdk.collection({
      slot: 'test',
      sort: [{
        order: 'testOrder',
      }],
    });
  }));

  it('should throw validation Error if "sort.order" param is not provided', sortOrderParamExistanceCase((sdk) => {
    sdk.collection({
      slot: 'test',
      sort: [{
        field: 'testField',
      }],
    });
  }));
});
