const ProductRouter = require('./Router');
const {routeWithHandle, checkEmptyParams, checkParamIsObjectId} = require('@notores/core');


routeWithHandle(
    'notores-product-homepage',
    '/',
    [
        ProductRouter.loadHot,
    ],
    {
        accepts: ['html', 'json'],
    },
);

routeWithHandle(
    'notores-readProducts',
    '/products',
    [
        ProductRouter.get,
    ],
    {
        accepts: ['html', 'json'],
    },
);

routeWithHandle(
    'notores-readProducts',
    '/hot',
    [
        ProductRouter.getHot,
    ],
    {
        accepts: ['html', 'json'],
    },
);

routeWithHandle(
    'notores-admin-readProducts',
    '/products',
    [
        ProductRouter.getAdmin,
    ],
    {
        accepts: ['html', 'json'],
        admin: true,
    },
);

routeWithHandle(
    'notores-readProductFromUrl',
    '/:productUrl',
    [
        checkEmptyParams,
        ProductRouter.getByProductUrl,
    ],
    {
        accepts: ['html', 'json'],
    },
);

routeWithHandle(
    'notores-admin-readProductFromMongoId',
    '/:productId',
    [
        checkEmptyParams,
        checkParamIsObjectId('productId'),
        ProductRouter.getById,
    ],
    {
        accepts: ['html', 'json'],
        admin: true,
    },
);

routeWithHandle(
    'notores-admin-createProduct',
    '/product',
    [
        ProductRouter.post,
    ],
    {
        method: 'post',
        admin: true
    },
);

routeWithHandle(
    'notores-admin-updateProductWithId',
    '/product/:productId',
    [
        checkEmptyParams,
        checkParamIsObjectId('productId'),
        ProductRouter.patch,
    ],
    {
        method: 'patch',
        admin: true
    },
);

routeWithHandle(
    'notores-admin-deleteProduct',
    '/product/:productId',
    [
        checkEmptyParams,
        checkParamIsObjectId('productId'),
        ProductRouter.delete,
    ],
    {
        method: 'delete',
        admin: true
    },
);
