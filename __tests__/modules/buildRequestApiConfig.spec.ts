import * as expect from 'expect';
import { buildRequestApiConfig } from '../../src/modules/buildRequestApiConfig';

describe('buildRequestApiConfig', () => {
  const key = 'testApiKey';

  it('should add "host" as "https://api-v3.findify.io"', () => {
    expect(buildRequestApiConfig({ key })).toContain({
      host: 'https://api-v3.findify.io',
    });
  });

  it('should add "jsonpCallbackPrefix" as "findifyCallback"', () => {
    expect(buildRequestApiConfig({ key })).toContain({
      jsonpCallbackPrefix: 'findifyCallback',
    });
  });

  it('should add "method" as provided "method" value', () => {
    expect(buildRequestApiConfig({ key, method: 'post' })).toContain({
      method: 'post',
    });
  });

  it('should add "method" as "jsonp" by default if nothing was provided', () => {
    expect(buildRequestApiConfig({ key })).toContain({
      method: 'jsonp',
    });
  });

  it('should add "key" as provided "key" value', () => {
    expect(buildRequestApiConfig({ key })).toContain({ key });
  });
});
