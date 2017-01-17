import * as expect from 'expect';
import * as validations from '../src/validations';

const {
  validateInitParams,
  validateAutocompleteParams,
  validateSearchParams,
  validateCollectionParams,
  validateRecommendationsParams,
  validateFeedbackParams,
}: any = validations;

describe('validations', () => {
  describe('validateInitParams', () => {
    it('should throw an Error if "key" is not provided', () => {
      expect(() => validateInitParams()).toThrow(/"key" param is required/);
      expect(() => validateInitParams({})).toThrow(/"key" param is required/);
    });
  });

  describe('validateAutocompleteParams', () => {
    it('should throw validation Error if "q" param is not provided', () => {
      expect(() => validateAutocompleteParams()).toThrow(/"q" param is required/);
      expect(() => validateAutocompleteParams({})).toThrow(/"q" param is required/);
    });
  });

  describe('validateSearchParams', () => {
    it('should throw an Error if "q" param is not provided', () => {
      expect(() => validateSearchParams()).toThrow(/"q" param is required/);
      expect(() => validateSearchParams({})).toThrow(/"q" param is required/);
    });
  });

  describe('validateCollectionParams', () => {
    it('should throw validation Error if "slot" param is not provided', () => {
      expect(() => validateCollectionParams()).toThrow(/"slot" param is required/);
      expect(() => validateCollectionParams({})).toThrow(/"slot" param is required/);
    });
  });

  describe('validateRecommendationsParams', () => {
    describe('predefined', () => {
      it('should throw validation Error if "slot" param is not provided', () => {
        expect(() => validateRecommendationsParams('predefined')).toThrow(/"slot" param is required/);
        expect(() => validateRecommendationsParams('predefined', {})).toThrow(/"slot" param is required/);
      });
    });

    describe('viewed', () => {
      it('should throw validation Error if "item_id" param is not provided', () => {
        expect(() => validateRecommendationsParams('viewed')).toThrow(/"item_id" param is required/);
        expect(() => validateRecommendationsParams('viewed', {})).toThrow(/"item_id" param is required/);
      });
    });

    describe('bought', () => {
      it('should throw validation Error if "item_id" param is not provided', () => {
        expect(() => validateRecommendationsParams('bought')).toThrow(/"item_id" param is required/);
        expect(() => validateRecommendationsParams('bought', {})).toThrow(/"item_id" param is required/);
      });
    });
  });

  describe('validateFeedbackParams', () => {
    it('should throw an Error if provided urecognized event', () => {
      expect(() => validateFeedbackParams('unrecognized', {
        suggestion: 'testSuggestion',
      })).toThrow(/Event not found/);

      expect(() => validateFeedbackParams('unrecognized')).toThrow(/Event not found/);
    });

    it('should throw an Error if "rid" is not provided at "click-suggestion" event', () => {
      expect(() => validateFeedbackParams('click-suggestion', {
        suggestion: 'testSuggestion',
      })).toThrow(/"rid" param is required/);
    });

    it('should throw an Error if "suggestion" is not provided at "click-suggestion" event', () => {
      expect(() => validateFeedbackParams('click-suggestion', {
        rid: 'testRid',
      })).toThrow(/"suggestion" param is required/);
    });

    it('should throw an Error if "item_id" is not provided at "click-item" event', () => {
      expect(() => validateFeedbackParams('click-item', {
        rid: 'testRid',
      })).toThrow(/"item_id" param is required/);

      expect(() => validateFeedbackParams('click-item', {})).toThrow(/"item_id" param is required/);
    });

    it('should throw an Error if "rid" is not provided at "redirect" event', () => {
      expect(() => validateFeedbackParams('redirect', {
        suggestion: 'testSuggestion',
      })).toThrow(/"rid" param is required/);
    });

    it('should throw an Error if "suggestion" is not provided at "redirect" event', () => {
      expect(() => validateFeedbackParams('redirect', {
        rid: 'testRid',
      })).toThrow(/"suggestion" param is required/);
    });

    it('should throw an Error if "order_id" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        currency: 'testCurrency',
        revenue: 100,
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }],
      })).toThrow(/"order_id" param is required/);
    });

    it('should throw an Error if "currency" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        revenue: 100,
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }],
      })).toThrow(/"currency" param is required/);
    });

    it('should throw an Error if "revenue" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }],
      })).toThrow(/"revenue" param is required/);
    });

    it('should throw an Error if "line_items" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        revenue: 100,
      })).toThrow(/"line_items" param is required/);
    });

    it('should throw an Error if "line_items[].item_id" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        revenue: 100,
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          unit_price: 100,
          quantity: 2,
        }],
      })).toThrow(/"line_items\[\]\.item_id" param is required/);
    });

    it('should throw an Error if "line_items[].unit_price" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        revenue: 100,
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          item_id: 'testItemId2',
          quantity: 2,
        }],
      })).toThrow(/"line_items\[\]\.unit_price" param is required/);
    });

    it('should throw an Error if "line_items[].quantity" is not provided at "purchase" event', () => {
      expect(() => validateFeedbackParams('purchase', {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        revenue: 100,
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          item_id: 'testItemId2',
          unit_price: 100,
        }],
      })).toThrow(/"line_items\[\]\.quantity" param is required/);
    });

    it('should throw an Error if "item_id" is not provided at "add-to-cart" event', () => {
      expect(() => validateFeedbackParams('add-to-cart', {})).toThrow(/"item_id" param is required/);
      expect(() => validateFeedbackParams('add-to-cart', {
        rid: 'testRid',
        quantity: 1,
      })).toThrow(/"item_id" param is required/);
    });

    it('should throw an Error if "line_items[].item_id" is not provided at "update-cart" event', () => {
      expect(() => validateFeedbackParams('update-cart', {
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          unit_price: 100,
          quantity: 2,
        }],
      })).toThrow(/"line_items\[\]\.item_id" param is required/);
    });

    it('should throw an Error if "line_items[].unit_price" is not provided at "update-cart" event', () => {
      expect(() => validateFeedbackParams('update-cart', {
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          item_id: 'testItemId2',
          quantity: 2,
        }],
      })).toThrow(/"line_items\[\]\.unit_price" param is required/);
    });

    it('should throw an Error if "line_items[].quantity" is not provided at "update-cart" event', () => {
      expect(() => validateFeedbackParams('update-cart', {
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 2,
        }, {
          item_id: 'testItemId2',
          unit_price: 100,
        }],
      })).toThrow(/"line_items\[\]\.quantity" param is required/);
    });
  });
});