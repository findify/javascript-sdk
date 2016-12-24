import { Config } from '../utils/requestApi';

function buildRequestApiConfig({
  method,
  key,
}: Props): Config {
  return {
    host: 'https://api-v3.findify.io',
    jsonpCallbackPrefix: 'findifyCallback',
    method: method || 'jsonp',
    key,
  };
}

type Props = {
  key: string,
  method?: 'jsonp' | 'post',
}

export {
  buildRequestApiConfig,
}
