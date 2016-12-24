import * as assign from 'lodash/assign';

function extendRequest(request: Request, config: FindifySDK.Config): ExtendedRequest<Request> {
  const extendedRequest = assign({}, {
    user: config.user,
    log: config.log,
  }, request, {
    t_client: (new Date()).getTime(),
  });

  const { user } = extendedRequest;

  if (typeof user === 'undefined') {
    throw new Error('`user` param should be provided either at request or at library config');
  }

  if (typeof user.uid === 'undefined') {
    throw new Error('"user.uid" param is required');
  }

  if (typeof user.sid === 'undefined') {
    throw new Error('"user.sid" param is required');
  }

  return extendedRequest as any;
}

type ExtendedRequest<Request> = Request & {
  user: FindifySDK.User,
  t_client: number,
  log?: boolean,
};

type Request = (
  FindifySDK.AutocompleteRequest |
  FindifySDK.SearchRequest |
  FindifySDK.CollectionRequest |
  FindifySDK.RecommendationsRequest
);

export {
  extendRequest,
}
