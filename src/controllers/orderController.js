import jwt from 'jsonwebtoken';

import OrderService from '../services/order.service.js';
import DetailOrderService from '../services/detailOrder.service.js';


const decodeToken = (token) => {
    const data = jwt.verify(token, "privateKeyHastToken");
    return data.userId;
}

const jsonStatus = (statusCode, message, data = []) => {
    return {
        statusCode: statusCode,
        message: message,
        data: data,
    }
}

const createOrder = async (request, response, next) => {
    if (!request.body.data.idConsumer) {
        return response.status(400).json(
            jsonStatus(400, 'Id consumer cannot be empty!')
        );
    }

    try {
        request.body.data.idConsumer = decodeToken(request.body.data.idConsumer);
        const orderService = new OrderService();
        const detailOrderService = new DetailOrderService();
        const order = await orderService.create(request.body.data);

        let detailOrderData = {
            idOrder: order,
            products: request.body.data.products,
            payment: request.body.data.payment,
        };

        const detailOrder = await detailOrderService.create(detailOrderData);
        return response.status(200).json(
            jsonStatus(200, 'Create order successfully!', { idOrder: order })
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, "An error occurred while creating the order!")
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
        return response.status(500).json(
            jsonStatus(500, "An error occurred while retrieving the order!")
        );
    }
    return response.status(200).json(
        jsonStatus(200, "Find all orders successfully!", documents)
    );
}

const findOneById = async (require, response, next) => {
    let filter = require.params.filter;
    try {
        const orderService = new OrderService();
        let document = await orderService.findById(filter);

        if (!document) {
            return response.status(404).json(
                jsonStatus(404, "Order not found")
            );
        }

        return response.status(200).json(
            jsonStatus(200, "Find order successfully!", document)
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving order with id = ${require.params.filter}!`)
        );
    }
}

// const findDetailOrder = async (require, response, next) => {
//     let filter = require.params.filter;
//     try {
//         const orderService = new OrderService();
//         let document = await orderService.findById(filter);
//         if (!document) {
//             return next(new ApiError(404, "Order not found"));
//         } else {
//             const detailOrderService = new DetailOrderService();
//             const detaiOrder = await detailOrderService.findById(document.idOrder);
//             return response.send(detaiOrder);
//         }
//     } catch (error) {
//         console.log(error);
//         return next(
//             new ApiError(500, `Error retrieving order with id = ${require.params.filter}!`)
//         )
//     }
// }

const findDetailOrder = async (request, response, next) => {
    let filter = request.params.filter;
    try {
        const detailOrderService = new DetailOrderService();
        const document = await detailOrderService.findById(filter);

        if (!document) {
            return response.status(404).json(
                jsonStatus(404, "Order not found")
            );
        }

        return response.status(200).json(
            jsonStatus(200, "Find order successfully!", document)
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving order with id = ${request.params.filter}!`)
        );
    }
}

const findAllWithIdConsumer = async (request, response) => {
    let documents = [];
    try {
        const token = request.params.token;
        const idConsumer = decodeToken(token);
        const filter = { idConsumer: idConsumer };

        const orderService = new OrderService();
        documents = await orderService.find(filter);
        if (!documents) {
            return response.status(404).json(
                jsonStatus(404, "Order not found")
            );
        }

        return response.status(200).json(
            jsonStatus(200, "Find order successfully!", documents)
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving order with id = ${request.params.filter}!`)
        );
    }

}

const deleteOrder = async (require, response, next) => {
    try {
        const orderService = new OrderService();
        const detailOrderService = new DetailOrderService();

        const order = await orderService.findById(require.params.filter);

        if (!order) {
            return response.status(404).json(
                jsonStatus(404, "Order not found!")
            );
        } else {
            await orderService.delete(require.params.filter);
            await detailOrderService.delete(order.idOrder);
        }
        return response.status(200).json(
            jsonStatus(200, "Order was deleted successfully!")
        );

    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving order with id = ${require.params.filter}!`)
        );
    }
}

const update = async (request, response, next) => {
    let idOrder = request.params.filter;

    try {
        const orderService = new OrderService();
        await orderService.update(idOrder, { status: 'Đơn hàng đang được chuẩn bị' })
        return response.status(200).json(
            jsonStatus(200, "Order was deleted successfully!")
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving order with id = ${require.params.filter}!`)
        );
    }
}

export {
    createOrder,
    findAll,
    findOneById,
    findDetailOrder,
    deleteOrder,
    findAllWithIdConsumer,
    update,
}