import { ObjectId } from "mongodb";
import MongoDB from "../configs/mongoDBConfig.js";

class CartService {
    constructor() {
        this.Cart = (MongoDB.client).db().collection("carts");
    }

    extractCartData(payload) {
        const cart = {
            idConsumer: payload.idConsumer,
            products: payload.products,
        }
        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    async create(payload) {
        const cart = this.extractCartData(payload);
        const result = await this.Cart.findOneAndUpdate(
            cart,
            { $set: {} },
            { returnDocument: "after", upsert: true },
        )
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Cart.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Cart.findOne({
            idConsumer: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }


    extractCartDataUpdate(payload) {
        const dataCartUpdate = {
            products: payload.products
        };

        Object.keys(dataCartUpdate).forEach(
            (key) => dataCartUpdate[key] === undefined && delete dataCartUpdate[key]
        )
        return dataCartUpdate;
    }

    async update(id, payload) {
        const filter = {
            idConsumer: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const dataUpdate = this.extractCartDataUpdate(payload);

        const result = await this.Cart.findOneAndUpdate(
            filter,
            { $set: dataUpdate },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const filter = {
            idConsumer: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        return await this.Cart.findOneAndDelete(filter);
    }

}
export default CartService;