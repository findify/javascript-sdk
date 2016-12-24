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

  describe('search', () => {
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

  describe('collection', () => {
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

  describe('autocomplete', () => {
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
});
