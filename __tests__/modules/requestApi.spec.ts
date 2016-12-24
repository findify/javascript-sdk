import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as qs from 'qs';
import * as url from 'url';
import { toPlainObject } from 'lodash';
import { setupJsDom, teardownJsDom } from '../jsdom-helper';

import { requestApi } from '../../src/modules/requestApi';

describe('request', () => {
  const path = '/test-path';
  const key = 'testApiKey';

  beforeEach(() => {
    fauxJax.install();
  });

  afterEach(() => {
    fauxJax.restore();
  });

  describe('jsonp method in browser', () => {
    const requestData = { value: 'testValue' };
    const method = 'jsonp';
    const makeRequestApi = () => requestApi(path, requestData, { key });
    const getQueryParams = (link: string) => qs.parse(url.parse(link).query);

    beforeEach((done) => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('should use jsonp when { method: "jsonp" } is provided', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('GET');
        done();
      });

      makeRequestApi();
    });

    it('should send `x-key` param in request params', (done) => {
      fauxJax.on('request', (req) => {
        const queryParams = getQueryParams(req.requestURL);

        expect(queryParams.key).toBe(key);

        done();
      });

      makeRequestApi();
    });

    it('should send `requestData` variable as request params', (done) => {
      fauxJax.on('request', (req) => {
        const queryParams = getQueryParams(req.requestURL);

        expect(queryParams.value).toBe(requestData.value);

        done();
      });

      makeRequestApi();
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

      makeRequestApi()
        .then((response) => {
          expect(response).toEqual(responseBody);
          done();
        })
        .catch(done);
    });
  });

  describe('jsonp method in node', () => {
    it('should throw an Error when { method: "jsonp" } option is provided', () => {
      const requestData = { value: 'testValue' };
      const method = 'jsonp';

      expect(() => requestApi(path, requestData, {
        key,
        method,
      })).toThrow(/jsonp method is not allowed in node environment/);
    });
  });

  describe('post method in browser', () => {
    beforeEach((done) => {
      setupJsDom(() => done());
    });

    afterEach(() => {
      teardownJsDom();
    });

    it('should use POST for requests bigger than 4096 bytes when { method: "jsonp" } is provided', (done) => {
      const requestData = { value: (new Array(4097)).join('.') };
      const method = 'jsonp';

      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');

        done();
      });

      requestApi(path, requestData, { key, method });
    });

    it('should use POST when { method: "post" } option is provided', (done) => {
      const requestData = { value: 'testValue' };
      const method = 'post';

      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');

        done();
      });

      requestApi(path, requestData, { key, method });
    });
  });

  describe('post method in node', () => {
    const requestData = { value: 'testValue' };
    const method = 'post';
    const makeRequestApi = () => requestApi(path, requestData, { key, method });

    it('should use POST in node environment when { method: "post" } is provided', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('POST');
        done();
      });

      requestApi(path, {}, { key, method });
    });

    it('should send `x-key` param in request headers', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestHeaders['x-key']).toBe(key);
        done();
      });

      makeRequestApi();
    });

    it('should send `requestData` variable as request body', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestBody).toBe(JSON.stringify(requestData));
        done();
      });

      makeRequestApi();
    });

    it('should set `content-type: application/json` in request headers', (done) => {
      fauxJax.on('request', (req) => {
        expect(req.requestHeaders['content-type']).toBe('application/json');
        done();
      });

      makeRequestApi();
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

      makeRequestApi()
        .then((response) => {
          expect(response).toEqual(responseBody);
          done();
        })
        .catch(done);
    });
  });
});
