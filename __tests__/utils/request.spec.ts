import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as jsdom from 'jsdom';
import * as qs from 'qs';
import * as url from 'url';
import { toPlainObject } from 'lodash';

import { request } from '../../src/utils/request';

declare const global: {
  window: any,
  document: any,
}

describe('request', () => {
  const host = 'http://test-host.com';
  const path = '/test-path';
  const apiKey = 'testApiKey';

  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  describe('jsonp method in browser', () => {
    const requestData = { value: 'testValue' };
    const makeRequest = () => request(path, requestData, { apiKey, host });
    const getQueryParams = (link: string) => qs.parse(url.parse(link).query);

    beforeEach((done) => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('should use jsonp for requests smaller than 4096 bytes by default', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('GET');
        done();
      });

      makeRequest();
    });

    it('should send `x-key` param in request params', (done) => {
      fauxJax.on('request', (req) => {
        const queryParams = getQueryParams(req.requestURL);

        expect(queryParams.key).toBe(apiKey);

        done();
      });

      makeRequest();
    });

    it('should send request to url, according to given host and path', (done) => {
      fauxJax.on('request', (req) => {
        const { protocol, hostname, pathname } = url.parse(req.requestURL);

        expect(url.resolve(protocol + '//' + hostname, pathname)).toBe(url.resolve(host, path));

        done();
      });

      makeRequest();
    });

    it('should send `requestData` variable as request params', (done) => {
      fauxJax.on('request', (req) => {
        const queryParams = getQueryParams(req.requestURL);

        expect(queryParams.value).toBe(requestData.value);

        done();
      });

      makeRequest();
    });

    it('should resolve server response body', (done) => {
      const responseBody = {
        value: 'test response body value',
        value2: 'test response body value2',
        value3: 'test response body value3',
      };

      fauxJax.on('request', (req) => {
        const { callback } = getQueryParams(req.requestURL);

        req.respond(200, {}, `typeof ${callback} === 'function' && ${callback}(${JSON.stringify(responseBody)})`);
      });

      makeRequest()
        .then((response) => {
          expect(response).toEqual(responseBody);
          done();
        })
        .catch(done);
    });

    it('should set custom callback prefix if it is provided', (done) => {
      const jsonpCallbackPrefix = 'testPrefix';

      fauxJax.on('request', (req) => {
        const { callback } = getQueryParams(req.requestURL);

        expect(callback.indexOf(jsonpCallbackPrefix) >= 0).toBeTruthy();

        done();
      });

      request(path, requestData, { apiKey, jsonpCallbackPrefix, host })
    });
  });

  describe('jsonp method in node', () => {
    it('should throw an Error when { method: "jsonp" } option is provided', () => {
      const requestData = { value: 'testValue' };
      const method = 'jsonp';

      expect(() => request(path, requestData, { apiKey, host, method })).toThrow(/jsonp method is not allowed in node environment/);
    });
  });

  describe('post method in browser', () => {
    beforeEach((done) => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('should use post for requests bigger than 4096 bytes by default', (done) => {
      const requestData = { value: (new Array(4097)).join('.') };

      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');

        done();
      });

      request(path, requestData, { apiKey, host });
    });

    it('should use post when { method: "post" } option is provided', (done) => {
      const requestData = { value: 'testValue' };
      const method = 'post';

      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');

        done();
      });

      request(path, requestData, { apiKey, host, method })
    });
  });

  describe('post method in node', () => {
    const requestData = { value: 'testValue' };
    const makeRequest = () => request(path, requestData, { apiKey, host });

    it('should use POST in node environment by default', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');
        done();
      });

      request(path, {}, { apiKey, host });
    });

    it('should send `x-key` param in request headers', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestHeaders['x-key']).toBe(apiKey);
        done();
      });

      makeRequest();
    });

    it('should send request to url, according to given host and path', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL).toBe(host + path);
        done();
      });

      makeRequest();
    });

    it('should send `requestData` variable as request body', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestBody).toBe(JSON.stringify(requestData));
        done();
      });

      makeRequest();
    });

    it('should set `content-type: application/json` in request headers', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestHeaders['content-type']).toBe('application/json');
        done();
      });

      makeRequest();
    });

    it('should resolve server response body', (done) => {
      const responseBody = {
        value: 'test response body value',
      };

      fauxJax.on('request', (req) => {
        req.respond(200, {
          'Content-Type': 'application/json',
        }, JSON.stringify(responseBody));
      });

      makeRequest()
        .then((response) => {
          expect(response).toEqual(responseBody);
          done();
        })
        .catch(done);
    });
  });
});

function setupJsDom(onInit?) {
  jsdom.env({
    html: '<!DOCTYPE html><html><head></head><body></body></html>',
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script'],
    },
    done: (err, window) => {
      global.window = window;
      global.document = window.document;

      onInit && onInit();
    },
  });
}

function teardownJsDom() {
  delete global.window;
  delete global.document;
}
