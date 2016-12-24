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

describe('autocomplete', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  it('should add passed request params to request body', (done) => {
    const request = {
      q: 'test',
      suggestion_limit: 10,
      item_limit: 15,
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

    sdk.autocomplete(request);
  });

  it('should send request to /autocomplete endpoint', (done) => {
    fauxJax.on('request', (req) => {
      expect(req.requestURL.indexOf('/autocomplete') > -1).toBe(true);
      done();
    });

    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    sdk.autocomplete({
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

    expect(() => (sdk as any).autocomplete()).toThrow(errorRegex);
    expect(() => (sdk as any).autocomplete({})).toThrow(errorRegex);
  });
});
