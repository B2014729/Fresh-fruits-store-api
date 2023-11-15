import { ObjectId } from "mongodb";
import MongoDB from "../configs/mongoDBConfig.js";

class DetailOrderService {
    constructor() {
        this.OrderDetail = (MongoDB.client).db().collection('order_detail');
    }

    extractOrderDetailData(payload) {
        const OrderDetail = {
            idOrder: payload.idOrder,
            products: payload.products,
            payment: payload.payment,
        };

        Object.keys(OrderDetail).forEach(
            (key) => OrderDetail[key] === undefined && delete OrderDetail[key]
        )
        return OrderDetail;
    }

    async create(payload) {
        const orderDetail = this.extractOrderDetailData(payload);
        const result = await this.OrderDetail.findOneAndUpdate(
            orderDetail,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.OrderDetail.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.OrderDetail.findOne({
            idOrder: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            idOrder: id,
        };

        const dataUpdate = this.extractOrderDetailData(payload);

        const result = await this.OrderDetail.findOneAndUpdate(
            filter,
            { $set: dataUpdate },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const filter = {
            idOrder: id,
        };

        return await this.OrderDetail.findOneAndDelete(filter);
    }
}

export default DetailOrderService;