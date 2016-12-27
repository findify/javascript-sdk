declare namespace __FindifySDK {
  type Config = {
    key: string,
    user?: User,
    method?: 'post' | 'jsonp',
    log?: boolean,
  };

  type User = {
    uid: string,
    sid: string,
    email?: string,
    ip?: string,
    ua?: string,
    lang?: string[],
  };

  type Product = {
    id: string,
  };

  type AutocompleteSuggestion = {
    value: string,
    redirect: Redirect,
  };

  type Redirect = {
    name: string,
    url: string,
  };
}

declare module "findify-sdk" {
  export = __FindifySDK;
}
