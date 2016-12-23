import * as fauxJax from 'faux-jax';
import * as expect from 'expect';

import FindifySDK from '../src/index';

const key = 'testApiKey';
const user = {
  uid: 'testUserId',
  sid: 'testSessionId',
}

function filterNameParamExistanceCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      method: 'post',
      user,
      key,
    });

    expect(() => performRequest(sdk)).toThrow(/"filters.name" param is required/);
  }
}

function filterTypeParamExistanceCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      method: 'post',
      user,
      key,
    });

    expect(() => performRequest(sdk)).toThrow(/"filters.type" param is required/);
  }
}

function sortFieldParamExistanceCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      method: 'post',
      user,
      key,
    });

    expect(() => performRequest(sdk)).toThrow(/"sort.field" param is required/);
  }
};

function sortOrderParamExistanceCase(performRequest) {
  return function() {
    const sdk = new FindifySDK({
      method: 'post',
      user,
      key,
    });

    expect(() => performRequest(sdk)).toThrow(/"sort.order" param is required/);
  }
};

export {
  filterNameParamExistanceCase,
  filterTypeParamExistanceCase,
  sortFieldParamExistanceCase,
  sortOrderParamExistanceCase,
};
