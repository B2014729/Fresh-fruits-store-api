import ApiError from '../api-error.js';

import OrderService from '../services/order.service.js';
import DetailOrderService from '../services/detailOrder.service.js';


const createOrder = async (request, response, next) => {
    if (!request.body.idOrder) {
        return next(new ApiError(400, 'Id order cannot be empty!'));
    }
    try {
        const orderService = new OrderService();
        const detailOrderService = new DetailOrderService();
        const order = await orderService.create(request.body);
        const detailOrder = await detailOrderService.create(request.body);
        return response.send(order);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the order!")
        );
    }
}


const findAll = async (request, response, next) => {
    let documents = [];
    try {
        const orderService = new OrderService();
        documents = await orderService.find({});
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while retrieving orders!")
        )
    }
    return response.send(documents);
}

const findOneById = async (require, response, next) => {
    let filter = require.params.filter;
    try {
        const orderService = new OrderService();
        let document = await orderService.findById(filter);

        if (document.length == 0) {
            return next(new ApiError(404, "Order not found"));
        }

        return response.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving order with id = ${require.params.filter}!`)
        )
    }
}

const findDetailOrder = async (require, response, next) => {
    let filter = require.params.filter;
    try {
        const orderService = new OrderService();
        let document = await orderService.findById(filter);
        if (document.length == 0) {
            return next(new ApiError(404, "Order not found"));
        } else {
            const detailOrderService = new DetailOrderService();
            const detaiOrder = await detailOrderService.findById(document.idOrder);
            return response.send(detaiOrder);
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving order with id = ${require.params.filter}!`)
        )
    }
}

const deleteOrder = async (require, response, next) => {
    try {
        const orderService = new OrderService();
        const detailOrderService = new DetailOrderService();

        const order = await orderService.findById(require.params.filter);

        if (!order) {
            return next(new ApiError(404, "Order not found!"));
        } else {
            await orderService.delete(require.params.filter);
            await detailOrderService.delete(order.idOrder);
        }
        return response.send({ message: "Order was deleted successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving order with id = ${require.params.filter}!`)
        )
    }
}

export {
    createOrder,
    findAll,
    findOneById,
    findDetailOrder,
    deleteOrder
}