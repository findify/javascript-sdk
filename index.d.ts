declare namespace FindifySDK {
  type Config = {
    apiKey: string,
    user?: User,
    method?: 'post' | 'jsonp',
    log?: boolean,
  }

  type User = {
    uid: string,
    sid: string,
    email?: string,
    ip?: string,
    ua?: string,
    lang?: string[],
  }

  type Redirect = {
    name: string,
    url: string,
  }

  type Product = {
    id: string,
  }

  type AutocompleteRequest = {
    q: string,
    user?: User,
    suggestion_limit?: number,
    item_limit?: string,
  }

  type AutocompleteResponse = {
    suggestions: AutocompleteSuggestion[],
    items: Product[],
    meta: {
      rid: string,
      q: string,
      suggestion_limit: number,
      item_limit: number,
    },
  }

  type AutocompleteSuggestion = {
    value: string,
    redirect: Redirect,
  }
}
