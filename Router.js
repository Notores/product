const logger = require('@notores/core/logger')(module);
const {stringToUrl} = require("./lib/stringExtend");

class ProductRouter {

    static getModel() {
        return require('./model').Product.model;
    }

    static getModelWrapper() {
        return require('./model').Product;
    }

    static async get(req, res, next) {
        res.locals.page = 'products';
        await ProductRouter.getProductList(req, res);

        next();
    }

    static async getHot(req, res, next) {
        res.locals.page = 'products';
        await ProductRouter.getProductList(req, res, [{hot: true}]);

        next();
    }

    //only load hot, do not
    static async loadHot(req, res, next) {
        await ProductRouter.getProductList(req, res, [{hot: true}], 'hot');

        next();
    }

    static async getProductList(req, res, filters = [], key = 'product') {
        const Wrapper = ProductRouter.getModelWrapper();
        const Product = ProductRouter.getModel();

        const mongoQuery = {$and: [{live: true}, ...filters]};

        if (req.query.q) {
            const fields = Wrapper.whitelist.search;

            const queryArr = req.query.q.trim().split(' ');

            const $or = [];
            fields.forEach(field => {
                queryArr.forEach(queryWord => {
                    $or.push({
                        [field]: {$regex: queryWord, $options: 'i'}
                    })
                });
            });

            mongoQuery.$and.push({
                $or
            });
        }
        const q = Product.find(mongoQuery);
        q.sort({createdOn: 'descending'});
        q.select(Wrapper.whitelist.get);

        const result = await q.exec();

        res.locals.setBody({[key]: result, query: req.query});
    }

    static async getAdmin(req, res, next) {
        res.locals.page = 'products';

        const Product = ProductRouter.getModel();

        const q = Product.find();
        q.sort({createdOn: 'descending'});

        const result = await q.exec();

        res.locals.setBody({product: result});

        next();
    }

    static async getById(req, res, next) {
        const id = req.params.id;

        try {
            const Product = ProductRouter.getModel();

            const result = await Product.findById(id)
                .exec();

            if (result)
                res.locals.page = 'product-id';
            else
                return next('route');

            res.locals.setBody({product: result});
            res.locals.page = 'single-product';
            return next();
        } catch (e) {
            res.locals.setBody({product: e});
        }
        next('route');
    }

    static async getByProductUrl(req, res, next) {
        try {
            const Wrapper = ProductRouter.getModelWrapper();
            const Product = Wrapper.model;

            const result = await Product.findOne({live: true, url: req.params.productUrl})
                .select(Wrapper.whitelist.get)
                .populate('relatedProducts')
                .exec();

            if (result)
                res.locals.page = 'single-product';
            else
                return next('route');

            res.locals.setBody({product: result});
            res.locals.page = 'single-product';
            return next();
        } catch (e) {
            res.locals.setBody({product: e});
        }

        next('route');
    }

    static async post(req, res, next) {
        const Product = ProductRouter.getModel();

        let newProduct;

        if (!req.body.url)
            req.body.url = stringToUrl(req.body.title);

        try {
            const result = await Product.insertMany(req.body);

            if (result.length === 1)
                newProduct = result[0];
            else
                newProduct = result;

            res.locals.setBody({product: newProduct});
        } catch (e) {
            res.locals.setBody({error: e.message});
            logger.error(e.message);
        }

        next();
    }

    static async patch(req, res, next) {
        const Product = ProductRouter.getModel();

        const product = await Product.findById(req.params.id);

        if (product)
            await product.updateAndSave(req.body);

        res.locals.setBody({product});

        next();
    }

    static async delete(req, res, next) {
        const Product = ProductRouter.getModel();

        const result = await Product.deleteOne({_id: req.params.productId}).exec();

        res.locals.setBody({product: result});
        next();
    }

}

module.exports = ProductRouter;
