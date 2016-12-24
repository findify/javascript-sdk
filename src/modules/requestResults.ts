import { extendRequest, ConfigData } from './extendRequest';

function requestResults(endpoint: string, request: Request, configData: ConfigData) {

}

type Request = FindifySDK.SearchRequest | FindifySDK.CollectionRequest;

export {
  requestResults,
};
