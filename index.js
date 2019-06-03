const {NotoresModule} = require('@notores/core');

class ProductModule extends NotoresModule {

    init(){
        super.init();

        const Locals = require('@notores/core').Locals;

        Locals.extend({
            price(price) {
                return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
            }
        });

        const Product = require('./models/product');
        this.setModel(Product.modelName, Product);
        Product.loadModel();

        require('./routes');
    }
}

module.exports = new ProductModule();
