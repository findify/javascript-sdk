import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';
import { setupJsDom, teardownJsDom } from './jsdom-helper';

import FindifySDK from '../src/index';

describe('FindifySDK', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  const key = 'testApiKey';
  const user = {
    uid: 'testUserId',
    sid: 'testSessionId',
  };

  describe('generic', () => {
    it('should be instantiated', () => {
      const sdk = new FindifySDK({ key });
    });

    it('should throw validation error if "key" param is not provided', () => {
      expect(() => new (FindifySDK as any)()).toThrow(/"key" param is required/);
      expect(() => new (FindifySDK as any)({})).toThrow(/"key" param is required/);
    });

    // it('should throw validation error if "key" param is not string', () => {
    //   expect(() => new FindifySDK({ key: 1 })).toThrow(/"key" param should be a string/);
    // });
  });

  describe('autocomplete', () => {
    it('should use jsonp by default if "method" is not provided at config', (done) => {
      setupJsDom(() => {
        fauxJax.on('request', (req) => {
          expect(req.requestMethod).toBe('GET');
          teardownJsDom();
          done();
        });

        const sdk = new FindifySDK({ key });

        sdk.autocomplete({
          q: 'test',
          user,
        });
      });
    });

    it('should use jsonp if { method: "jsonp" } is provided', (done) => {
      setupJsDom(() => {
        fauxJax.on('request', (req) => {
          expect(req.requestMethod).toBe('GET');
          teardownJsDom();
          done();
        });

        const sdk = new FindifySDK({
          key,
          method: 'jsonp',
        });

        sdk.autocomplete({
          q: 'test',
          user,
        });
      });
    });

    it('should use POST if { method: "post" } is provided', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');
        done();
      });

      const sdk = new FindifySDK({
        key,
        method: 'post',
      });

      sdk.autocomplete({
        q: 'test',
        user,
      });
    });

    it('should throw an Error if "user" param is not provided neither at configuration nor in request', () => {
      const sdk = new FindifySDK({ key });
      expect(() => sdk.autocomplete({
        q: 'test',
      })).toThrow(/`user` param should be provided at request or at library config/);
    });

    it('should add "user" param to request body if it`s provided at sdk initialization', (done) => {
      fauxJax.on('request', (req) => {
        const requestBody = JSON.parse(req.requestBody);

        expect(requestBody.user).toBeA('object');

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

    it('should add "user" param to request body if it`s provided as a request method param', (done) => {
      fauxJax.on('request', (req) => {
        const requestBody = JSON.parse(req.requestBody);

        expect(requestBody.user).toBeA('object');

        done();
      });

      const sdk = new FindifySDK({
        key,
        method: 'post',
      });

      sdk.autocomplete({
        q: 'test',
        user,
      });
    });

    it('should add "t_client" param to request body', (done) => {
      fauxJax.on('request', (req) => {
        const requestBody = JSON.parse(req.requestBody);

        expect(requestBody.t_client).toBeA('number');

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

    it('should add "log" param to request body if it`s provided at sdk initialization', (done) => {
      fauxJax.on('request', (req) => {
        const requestBody = JSON.parse(req.requestBody);

        expect(requestBody.log).toBe(true);

        done();
      });

      const sdk = new FindifySDK({
        key,
        method: 'post',
        user,
        log: true,
      });

      sdk.autocomplete({
        q: 'test',
      });
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

    it('should provide "key" param to headers', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestHeaders['x-key']).toBe(key);
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

    it('should add jsonp callback prefix as "findifyCallback"', (done) => {
      setupJsDom(() => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('findifyCallback') > -1).toBe(true);
          teardownJsDom();
          done();
        });

        const sdk = new FindifySDK({
          key,
          user,
        });

        sdk.autocomplete({
          q: 'test',
        });
      });
    });

    it('it should send requests to "https://api-v3.findify.io"', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('https://api-v3.findify.io') > -1).toBe(true);
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

    it('should trow validation Error if "q" param is not provided', () => {
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

    it('should throw validation Error if "user.uid" param is not provided at library configuration', () => {
      const sdk = new (FindifySDK as any)({
        key,
        method: 'post',
        user: {
          sid: 'testSessionId',
        },
      });

      expect(() => sdk.autocomplete({
        q: 'test',
      })).toThrow(/"user.uid" param is required/);
    });

    it('should throw validation Error if "user.uid" param is not provided at request', () => {
      const sdk = new FindifySDK({
        key,
        method: 'post',
      });

      expect(() => (sdk as any).autocomplete({
        q: 'test',
        user: {
          sid: 'testSessionId',
        },
      })).toThrow(/"user.uid" param is required/);
    });

    it('should throw validation Error if "user.sid" param is not provided at library configuration', () => {
      const sdk = new (FindifySDK as any)({
        key,
        method: 'post',
        user: {
          uid: 'testUserId',
        },
      });

      expect(() => sdk.autocomplete({
        q: 'test',
      })).toThrow(/"user.sid" param is required/);
    });

    it('should throw validation Error if "user.sid" param is not provided at request', () => {
      const sdk = new FindifySDK({
        key,
        method: 'post',
      });

      expect(() => (sdk as any).autocomplete({
        q: 'test',
        user: {
          uid: 'testUserId',
        },
      })).toThrow(/"user.sid" param is required/);
    });
  });
});
