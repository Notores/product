const {stringToUrl} = require("../lib/stringExtend");
const {Schema} = require('mongoose');
const {MongoSchema} = require('@notores/core');

const Product = new MongoSchema('Product', {
    ean: {type: String, required: false, index: false},
    sku: {
        type: String, required: true, index: false,
        default: function () {
            return this.ean;
        }
    },
    title: {type: String, required: true, index: false},
    description: {type: String, required: true},

    url: {
        type: String, required: false, index: false,
        default: function () {
            return stringToUrl(this.title);
        }
    },

    manufactureDetails: {
        modelNumber: {type: String},
        releaseDate: {type: Date, default: Date.now},
        manufacturer: {type: String}
    },

    stock: {
        amount: {type: Number, required: true, default: 0},
        track: {type: Boolean, required: true, default: true},
    },

    relatedProducts: [{type: Schema.Types.ObjectId, ref: 'Product'}],

    shippingDetails: {
        weight: {type: Number, default: 0},
        width: {type: Number, default: 0},
        height: {type: Number, default: 0},
        depth: {type: Number, default: 0},
    },

    pricing: {
        cost: {type: Number, required: true, default: 0.00},
        price: {type: Number, required: true, default: 0.00},
        vatPercentage: {type: Number, required: true, default: 21}, // Percentage in whole numbers
    },

    categories: [{type: String}],

    images: [{type: String, required: false}],

    digital:  {type: Boolean, required: true, default: false},

    live: {type: Boolean, required: true, default: false},
    hot: {type: Boolean, required: true, default: false},
}, {
    minimize: false,
    strict: false,
    timestamps: {createdOn: 'createdOn', updatedOn: 'updatedOn'}
});
//todo:
///todo:
Product.virtual('inStock').get(function () {
    if (this.stock.track)
        return this.stock.amount > 0;
    else
        return true;
});

Product.virtual('trackStock').get(function () {
    return this.stock.track;
});

Product.virtual('price').get(function () {
    return this.pricing.price;
});


Product.updateWhitelist('get', [
    'ean',
    'sku',
    'title',
    'description',
    'manufactureDetails.modelNumber',
    'manufactureDetails.releaseDate',
    'manufactureDetails.manufacturer',
    'stock',
    'relatedProducts',
    'pricing.price',
    'pricing.vatPercentage',
    'categories',
    'images',
    'url'
]);

Product.updateWhitelist('search', [
    'ean',
    'sku',
    'title',
    'description',
    'categories'

]);

module.exports = Product;

