import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';

import FindifySDK from '../src/index';

describe('FindifySDK', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  describe('generic', () => {
    it('should be instantiated', () => {
      const sdk = new FindifySDK({
        key: 'testApiKey',
      });
    });

    it('should throw validation error if "key" param is not provided', () => {
      expect(() => new (FindifySDK as any)()).toThrow(/"key" param is required/);
      expect(() => new (FindifySDK as any)({})).toThrow(/"key" param is required/);
    });

    // it('should throw validation error if "key" param is not string', () => {
    //   expect(() => new FindifySDK({ key: 1 })).toThrow(/"key" param should be a string/);
    // });
  });
});
