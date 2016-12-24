import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';

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
});
