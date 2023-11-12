import { ObjectId } from "mongodb";
import MongoDB from "../configs/mongoDBConfig.js";

class OrderService {
    constructor() {
        this.Order = (MongoDB.client).db().collection('orders');
    }

    extractOrderData(payload) {
        const order = {
            idOrder: payload.idOrder,
            idConsumer: payload.idConsumer,
            idStaff: payload.idStaff,
            orderDate: payload.orderDate,
            deliveryDate: payload.deliveryDate,
            deliveryAddress: payload.deliveryAddress,
            status: payload.status
        };

        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        )
        return order;
    }

    async create(payload) {
        const order = this.extractOrderData(payload);

        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const dataUpdate = this.extractOrderData(payload);

        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: dataUpdate },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        return await this.Order.findOneAndDelete(filter);
    }
}

export default OrderService;