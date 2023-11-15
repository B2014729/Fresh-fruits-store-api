import express from 'express';
import * as StaffController from '../controllers/staffController.js';
import * as ConsumerController from '../controllers/consumerColtroller.js';
import * as ProductController from '../controllers/productController.js';
import * as OrderController from '../controllers/orderController.js';
import * as CartController from '../controllers/cartController.js';

let router = express.Router();

const initWebRoute = (app) => {
    //_________________staff manager_______________________
    router.route('/staff-create')
        .post(StaffController.createStaff);

    router.route('/staff-list')
        .get(StaffController.findAll);

    router.route('/staff/:filter')
        .get(StaffController.findOneByNameOrId)
        .put(StaffController.updateStaff)
        .delete(StaffController.deleteStaff);

    //_________________consumer manager_______________________
    router.route('/consumer-login')
        .post(ConsumerController.login);
    router.route('/consumer-create')
        .post(ConsumerController.createConsumer);

    router.route('/consumer-list')
        .get(ConsumerController.findAll);

    router.route('/consumer-search/:filter')
        .get(ConsumerController.findOne)

    router.route('/consumer/:filter')
        .get(ConsumerController.findOneById)
        .put(ConsumerController.updateConsumer)
        .delete(ConsumerController.deleteConsumer);

    //_________________product manager_______________________
    router.route('/product-create')
        .post(ProductController.createProduct);

    router.route('/product-list')
        .get(ProductController.findAll);

    router.route('/product/:filter')
        .get(ProductController.findOneByNameOrId)
        .put(ProductController.updateProduct)
        .delete(ProductController.deleteProduct);
    router.route('/product-outstanding')
        .get(ProductController.findIsOutstanding);
    router.route('/product-type/:type')
        .get(ProductController.findProductWithType);

    //_________________order manager_______________________
    router.route('/order-create')
        .post(OrderController.createOrder);
    router.route('/order-list')
        .get(OrderController.findAll);
    router.route('/order/:filter')
        .get(OrderController.findOneById)
        .delete(OrderController.deleteOrder)
    router.route('/order-detail/:filter')
        .get(OrderController.findDetailOrder);

    //_________________cart manager_______________________
    router.route('/cart/:idUser')
        .get(CartController.findOneById)
        .put(CartController.updateCart);
    router.route('/cart-delete/:idUser')
        .put(CartController.deleteProductInCart);
    router.route('/cart-reset/:idUser')
        .get(CartController.resetCart);

    return app.use('/fresh-fruits-api', router);
}

export default initWebRoute;