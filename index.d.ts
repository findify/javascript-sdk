declare namespace FindifySDK {
  export type Config = {
    key: string,
    user?: User,
    method?: 'post' | 'jsonp',
    log?: boolean,
  }

  export type User = {
    uid: string,
    sid: string,
    email?: string,
    ip?: string,
    ua?: string,
    lang?: string[],
  }

  export type Redirect = {
    name: string,
    url: string,
  }

  export type Banner = {
    products: {
      image_url: string,
      target_url: string,
    },
  }

  export type Product = {
    id: string,
  }

  export type Facet = {
    name: string,
    type: string,
    sort_type: string,
    values: FacetValue[],
  }

  export type FacetValue = {
    selected: boolean,
    value: string,
    count: number,
    name: string,
    has_children: boolean,
    min: number,
    max: number,
    from: number,
    to: number,
    children: FacetValue[],
  }

  export type Filter = {
    name: string,
    type: string,
    values?: {
      value?: string,
      from?: string,
      to?: string,
    }[],
  }

  export type Sort = {
    field: string,
    order: string,
  }

  export type Request = (
    AutocompleteRequest |
    SearchRequest |
    CollectionRequest |
    RecommendationsRequest
  );

  export type AutocompleteRequest = {
    q: string,
    user?: User,
    suggestion_limit?: number,
    item_limit?: number,
  }

  export type AutocompleteResponse = {
    suggestions: AutocompleteSuggestion[],
    items: Product[],
    meta: {
      rid: string,
      q: string,
      suggestion_limit: number,
      item_limit: number,
    },
  }

  export type AutocompleteSuggestion = {
    value: string,
    redirect: Redirect,
  }

  export type ResultsRequest = {
    user?: User,
    filters?: Filter[],
    sort?: Sort[],
    offset?: number,
    limit?: number,
  }

  export type SearchRequest = ResultsRequest & {
    q: string,
  }

  export type SearchResponse = ResultsResponse & {
    redirect: Redirect,
    banner: Banner,
  };

  export type CollectionRequest = ResultsRequest & {
    slot: string,
  }

  export type CollectionResponse = ResultsResponse;

  type ResultsResponse = {
    meta: {
      rid: string,
      filters: Filter[],
      sort: Sort[],
      limit: number,
      offset: number,
      total: number,
    },
    items: Product[],
    facets: Facet[],
  };

  export type RecommendationsType = (
    'predefined' |
    'newest' |
    'trending' |
    'featured' |
    'latest' |
    'viewed' |
    'bought' 
  );

  export type RecommendationsRequest = (
    GenericRecommendationsRequest |
    NewestRecommendationsRequest |
    TrendingRecommendationsRequest |
    FeaturedRecommendationsRequest |
    LatestRecommendationsRequest |
    ViewedRecommendationsRequest |
    BoughtRecommendationsRequest
  );

  export type GenericRecommendationsRequest = {
    slot: string,
    item_id?: string,
  }

  export type NewestRecommendationsRequest = {
    offset?: string,
    limit?: number,
  }

  export type TrendingRecommendationsRequest = {
    offset?: string,
    limit?: number,
  }

  export type FeaturedRecommendationsRequest = {
  }

  export type LatestRecommendationsRequest = {
    offset?: string,
    limit?: number,
  }

  export type ViewedRecommendationsRequest = {
    item_id: string | number,
    offset?: string,
    limit?: number,
  }

  export type BoughtRecommendationsRequest = {
    item_id: string | number,
    offset?: string,
    limit?: number,
  }

  export type FeedbackRequest = {
    event: string,
    properties?: {
      [key: string]: any,
    },
  }
}

// declare module "findify-sdk" {
//   class SDK {
//     constructor(config: Config);
//     autocomplete(request: AutocompleteRequest);
//     search(request: SearchRequest);
//     collection(request: CollectionRequest);
//   }

//   export = SDK;
// }
