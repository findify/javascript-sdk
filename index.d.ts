import * as Types from './src/types';
import * as FindifySDK from './src';

declare module "@findify/findify-sdk" {
  type RecommendationsType = Types.RecommendationsType;

  type AutocompleteRequest = Types.AutocompleteRequest;
  type SearchRequest = Types.SearchRequest;
  type CollectionRequest = Types.CollectionRequest;
  type RecommendationsRequest = Types.RecommendationsRequest;
  type FeedbackRequest = Types.FeedbackRequest;

  type AutocompleteResponse = Types.AutocompleteResponse;
  type SearchResponse = Types.SearchResponse;
  type CollectionResponse = Types.CollectionResponse;
  type RecommendationsResponse = Types.RecommendationsResponse;

  type Client = FindifySDK.Client;
  type Config = Types.Config;
  type User = Types.User;

  type Product = Types.Product;
  type AutocompleteSuggestion = Types.AutocompleteSuggestion;
  type Redirect = Types.Redirect;
  type Filter = Types.Filter;
  type FilterValue = Types.FilterValue;
  type Facet = Types.Facet;
  type FacetValue = Types.FacetValue;
  type Sort = Types.Sort;
  type Banner = Types.Banner;

  function init(config: Config): Client;
}
