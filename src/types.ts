type User = {
  uid: string,
  sid: string,
  email?: string,
  ip?: string,
  ua?: string,
  lang?: string[],
}

type Filter = {
  name: string,
  type: string,
  values?: {
    value?: string,
    from?: string,
    to?: string,
  }[],
}

type Sort = {
  field: string,
  order: string,
}

type Redirect = {
  name: string,
  url: string,
}

type Banner = {
  products: {
    image_url: string,
    target_url: string,
  },
}

type Product = {
  id: string,
}

type Facet = {
  name: string,
  type: string,
  sort_type: string,
  values: FacetValue[],
}

type FacetValue = {
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

export AutocompleteSuggestion = {
  value: string,
  redirect: Redirect,
}

type RecommendationsType = (
  'generic' |
  'newest' |
  'trending' |
  'featured' |
  'latest' |
  'viewed' |
  'bought' 
);

type AutocompleteRequestBody = {
  q: string,
  user?: User,
  suggestion_limit?: number,
  item_limit?: number,
}

type ResultsRequestBody = {
  user?: User,
  filters?: Filter[],
  sort?: Sort[],
  offset?: number,
  limit?: number,
}

type FeedbackRequestBody = {
  event: string,
  properties?: {
    [key: string]: any,
  },
}

type PredefinedRecommendationsRequestBody = {
  item_id?: number | string,
}

type CommonRecommendationsRequestBody = {
  offset?: number,
  limit?: number,
}

type RecommendationsRequestBody = {
  PredefinedRecommendationsRequestBody |
  CommonRecommendationsRequestBody
}

type RequestBody = (
  AutocompleteRequestBody |
  ResultsRequestBody |
  FeedbackRequestBody |
  RecommendationsRequestBody
);

type AutocompleteRequest = AutocompleteRequestBody;

type SearchRequest = SearchRequestBody & {
  q: string,
}

type CollectionRequest = SearchRequestBody & {
  slot: string,
}

type FeedbackRequest = FeedbackRequestBody;

type PredefinedRecommendationsRequest = PredefinedRecommendationsRequestBody & {
  slot: string,
}

type NewestRecommendationsRequest = CommonRecommendationsRequestBody;

type TrendingRecommendationsRequest = CommonRecommendationsRequestBody;

type LatestRecommendationsRequest = CommonRecommendationsRequestBody;

type ViewedRecommendationsRequest = CommonRecommendationsRequestBody & {
  item_id: string | number,
}

type BoughtRecommendationsRequest = CommonRecommendationsRequestBody & {
  item_id: string | number,
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
}

type SearchResponse = ResultsResponse & {
  redirect: Redirect,
  banner: Banner,
}

type CollectionResponse = ResultsResponse

type RecommendationsResponse = {
  meta: {
    rid: string,
    limit: number,
    offset: number,
    total: number,
    item_id?: string,
    user_id?: string,
  },
  items: Product[],
}
