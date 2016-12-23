// use here repeating `it` functions makers from `requestApi` and `sdk`, they will be reausable in tests
import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import { setupJsDom, teardownJsDom } from './jsdom-helper';

import FindifySDK from '../src/index';

const key = 'testApiKey';
const user = {
  uid: 'testUserId',
  sid: 'testSessionId',
};

function jsonpRequestMethodCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
      method: 'jsonp',
    });

    setupJsDom(() => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('GET');
        teardownJsDom();
        done();
      });

      performRequest(sdk);
    });
  }
}

function jsonpByDefaultRequestMethodCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
    });

    setupJsDom(() => {
      fauxJax.on('request', (req) => {
        expect(req.requestMethod).toBe('GET');
        teardownJsDom();
        done();
      });

      performRequest(sdk);
    });
  }
}

function postRequestMethodCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
      method: 'post',
    });

    fauxJax.on('request', (req) => {
      expect(req.requestMethod).toBe('POST');
      done();
    });

    performRequest(sdk);
  }
}

function userParamValidationCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      key,
    });

    expect(() => performRequest(sdk)).toThrow(/`user` param should be provided at request or at library config/);
  }
}

function userParamRequestBodyAtConfigurationCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    fauxJax.on('request', (req) => {
      const requestBody = JSON.parse(req.requestBody);

      expect(requestBody.user).toBeA('object');

      done();
    });

    performRequest(sdk);
  }
}

function userParamRequestBodyAtRequestCase(user, performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      method: 'post',
    });

    fauxJax.on('request', (req) => {
      const requestBody = JSON.parse(req.requestBody);

      expect(requestBody.user).toBeA('object');

      done();
    });

    performRequest(sdk);
  }
}

function timestampAddingCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      method: 'post',
      user,
    });

    fauxJax.on('request', (req) => {
      const requestBody = JSON.parse(req.requestBody);

      expect(requestBody.t_client).toBeA('number');

      done();
    });

    performRequest(sdk);
  }
}

function logConfigParamCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
      method: 'post',
      log: true,
    });

    fauxJax.on('request', (req) => {
      const requestBody = JSON.parse(req.requestBody);

      expect(requestBody.log).toBe(true);

      done();
    });

    performRequest(sdk);
  }
}

function keyParamsInHeadersCase(key, performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
      method: 'post',
    });

    fauxJax.on('request', (req) => {
      expect(req.requestHeaders['x-key']).toBe(key);
      done();
    });

    performRequest(sdk);
  }
}

function jsonpCallbackPrefixCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
    });

    setupJsDom(() => {
      fauxJax.on('request', (req) => {
        expect(req.requestURL.indexOf('findifyCallback') > -1).toBe(true);
        teardownJsDom();
        done();
      });

      performRequest(sdk);
    });
  }
}

function apiHostnameCase(performRequest) {
  return function(done) {
    const sdk = new FindifySDK({
      key,
      user,
      method: 'post',
    });

    fauxJax.on('request', (req) => {
      expect(req.requestURL.indexOf('https://api-v3.findify.io') > -1).toBe(true);
      done();
    });

    performRequest(sdk);
  }
}

function uidParamExistanceAtConfigurationCase(performRequest) {
  return function() {
    const sdk = new (FindifySDK as any)({
      key: 'testApiKey',
      method: 'post',
      user: {
        sid: 'testSessionId',
      },
    });

    expect(() => performRequest(sdk)).toThrow(/"user.uid" param is required/);
  }
}

function uidParamExistanceAtRequestCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      key: 'testApiKey',
      method: 'post',
    });

    expect(() => performRequest(sdk)).toThrow(/"user.uid" param is required/);
  }
}

function sidParamExistanceAtConfigurationCase(performRequest) {
  return function() {
    const sdk = new (FindifySDK as any)({
      key: 'testApiKey',
      method: 'post',
      user: {
        uid: 'testUserId',
      },
    });

    expect(() => performRequest(sdk)).toThrow(/"user.sid" param is required/);
  }
}

function sidParamExistanceAtRequestCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      key: 'testApiKey',
      method: 'post',
    });

    expect(() => performRequest(sdk)).toThrow(/"user.sid" param is required/);
  }
}

export {
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
}
