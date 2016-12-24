import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as assign from 'lodash/assign';
import * as omit from 'lodash/omit';

import FindifySDK from '../src/index';

const initSdk = () => new FindifySDK({
  key: 'testApiKey',
  user: {
    uid: 'testUserId',
    sid: 'testSessionId',
  },
});

describe('FindifySDK', () => {
  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  describe('generic', () => {
    it('should be instantiated', () => {
      const sdk = initSdk();
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

        expect(requestBody).toContain(request);

        done();
      });

      const sdk = initSdk();

      sdk.search(request);
    });

    it('should send request to /search endpoint', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('/search') > -1).toBe(true);
        done();
      });

      const sdk = initSdk();

      sdk.search({
        q: 'test',
      });
    });

    it('should throw validation Error if "q" param is not provided', () => {
      const sdk = initSdk();

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

        expect(requestBody).toContain(request);

        done();
      });

      const sdk = initSdk();

      sdk.collection(assign({}, request, {
        slot: 'test',
      }));
    });

    it('should send request to /collection endpoint', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('/collection') > -1).toBe(true);
        done();
      });

      const sdk = initSdk();

      sdk.collection({
        slot: 'test',
      });
    });

    it('should send collection "slot" param in url', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('/collection/test_slot') > -1).toBe(true);
        done();
      });

      const sdk = initSdk();

      sdk.collection({
        slot: 'test_slot',
      });
    });

    it('should throw validation Error if "slot" param is not provided', () => {
      const sdk = initSdk();

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

        expect(requestBody).toContain(request);

        done();
      });

      const sdk = initSdk();

      sdk.autocomplete(request);
    });

    it('should send request to /autocomplete endpoint', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('/autocomplete') > -1).toBe(true);
        done();
      });

      const sdk = initSdk();

      sdk.autocomplete({
        q: 'test',
      });
    });

    it('should throw validation Error if "q" param is not provided', () => {
      const sdk = initSdk();

      const errorRegex = /"q" param is required/;

      expect(() => (sdk as any).autocomplete()).toThrow(errorRegex);
      expect(() => (sdk as any).autocomplete({})).toThrow(errorRegex);
    });
  });

  describe('feedback', () => {
    it('should throw validation Error if "event" param is not provided', () => {
      const sdk = initSdk();

      const errorRegex = /"event" param is required/;

      expect(() => (sdk as any).feedback()).toThrow(errorRegex);
      expect(() => (sdk as any).feedback({})).toThrow(errorRegex);
    });

    it('should send request to /feedback endpoint', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('/feedback') > -1).toBe(true);
        done();
      });

      const sdk = initSdk();

      sdk.feedback({
        event: 'test',
      });
    });

    it('should add passed request params to request body', (done) => {
      const request = {
        event: 'test',
        properties: {
          key: 'value',
        },
      };

      fauxJax.on('request', (req) => {
        const requestBody = omit(JSON.parse(req.requestBody), ['t_client']);

        expect(requestBody).toContain(request);

        done();
      });

      const sdk = initSdk();

      sdk.feedback(request);
    });
  });

  describe('recommendations', () => {
    describe('generic', () => {
      it('should throw validation Error if "slot" param is not provided', () => {
        const sdk = initSdk();

        const errorRegex = /"slot" param is required/;

        expect(() => (sdk as any).recommendations('generic')).toThrow(errorRegex);
        expect(() => (sdk as any).recommendations('generic', {})).toThrow(errorRegex);
      });

      it('should send request to "/recommend/{slot}" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/test') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('generic', {
          slot: 'test',
        });
      });

      it('should send provided request data as request body', (done) => {
        const slot = 'test';
        const item_id = 1;
        const request = {
          slot,
          item_id,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain({ item_id }).toNotContain({ slot });
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('generic', request);
      });
    });

    describe('newest', () => {
      it('should send request to "/recommend/items/newest" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/newest') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('newest');
      });

      it('should send provided request data as request body', (done) => {
        const request = {
          offest: 5,
          limit: 10,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain(request);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('newest', request);
      });
    });

    describe('trending', () => {
      it('should send request to "/recommend/items/trending" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/trending') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('trending');
      });

      it('should send provided request data as request body', (done) => {
        const request = {
          offest: 5,
          limit: 10,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain(request);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('trending', request);
      });
    });

    describe('featured', () => {
      it('should send request to "/recommend/items/featured" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/featured') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('featured');
      });
    });

    describe('latest', () => {
      it('should send request to "/recommend/items/viewed/latest" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/latest') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('latest');
      });

      it('should send provided request data as request body', (done) => {
        const request = {
          offest: 5,
          limit: 10,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain(request);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('latest', request);
      });
    });

    describe('viewed', () => {
      it('should send request to "/recommend/items/{item_id}/viewed/viewed" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/1/viewed/viewed') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('viewed', {
          item_id: 1,
        });
      });

      it('should send provided request data as request body', (done) => {
        const item_id = 1;
        const request = {
          item_id,
          offest: 5,
          limit: 10,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain(omit(request, ['item_id'])).toNotContain({ item_id });
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('viewed', request);
      });

      it('should throw validation Error if "item_id" param is not provided', () => {
        const sdk = initSdk();

        const errorRegex = /"item_id" param is required/;

        expect(() => (sdk as any).recommendations('viewed')).toThrow(errorRegex);
        expect(() => (sdk as any).recommendations('viewed', {})).toThrow(errorRegex);
      });
    });

    describe('bought', () => {
      it('should send request to "/recommend/items/{item_id}/viewed/bought" endpoint', (done) => {
        fauxJax.on('request', (req) => {
          expect(req.requestURL.indexOf('/recommend/items/1/viewed/bought') > -1).toBe(true);
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('bought', {
          item_id: 1,
        });
      });

      it('should send provided request data as request body', (done) => {
        const item_id = 1;
        const request = {
          item_id,
          offest: 5,
          limit: 10,
        };

        fauxJax.on('request', (req) => {
          expect(JSON.parse(req.requestBody)).toContain(omit(request, ['item_id'])).toNotContain({ item_id });
          done();
        });

        const sdk = initSdk();

        sdk.recommendations('bought', request);
      });

      it('should throw validation Error if "item_id" param is not provided', () => {
        const sdk = initSdk();

        const errorRegex = /"item_id" param is required/;

        expect(() => (sdk as any).recommendations('bought')).toThrow(errorRegex);
        expect(() => (sdk as any).recommendations('bought', {})).toThrow(errorRegex);
      });
    });
  });
});
