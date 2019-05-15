const {NotoresModule} = require('@notores/core');
class ProductModule extends NotoresModule {
    
    constructor(){
        super();

        const Product = require('./model');
        this.setModel(Product.modelName, Product);
        Product.loadModel();
    }

    init(){
        const Locals = require('@notores/core').Locals;

        Locals.extend({
            price(price) {
                return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
            }
        });

        require('./routes')();
    }
}

module.exports = new ProductModule();
