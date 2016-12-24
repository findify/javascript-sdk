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

describe('search', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  it('should add passed request params to request body', (done) => {
    const request = {
      q: 'test',
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

    sdk.search(request);
  });

  it('should send request to /search endpoint', (done) => {
    fauxJax.on('request', (req) => {
      expect(req.requestURL.indexOf('/search') > -1).toBe(true);
      done();
    });

    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    sdk.search({
      q: 'test',
    });
  });

  it('should throw validation Error if "q" param is not provided', () => {
    const sdk = new FindifySDK({
      key,
      method: 'post',
      user: {
        uid: 'testUserId',
        sid: 'testSessionId',
      },
    });

    const errorRegex = /"q" param is required/;

    expect(() => (sdk as any).search()).toThrow(errorRegex);
    expect(() => (sdk as any).search({})).toThrow(errorRegex);
  });
});
