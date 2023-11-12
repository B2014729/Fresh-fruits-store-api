import { ObjectId } from 'mongodb';
import MongoDB from '../configs/mongoDBConfig.js';
class ProductService {
    constructor() {
        this.Product = (MongoDB.client).db().collection("products");
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,
            image: payload.image,
            price: payload.price,
            hsd: payload.hsd,
            description: payload.description,
            origin: payload.origin,
            specifications: payload.specifications,//quy cách
            outstanding: payload.outstanding,
            quantity: payload.quantity,
            preserve: payload.preserve,
            type: payload.type,
        }

        Object.keys(product).forEach(
            (key) => {
                if (product[key] === undefined)
                    delete product[key];
            }
        );

        return product;
    }

    async create(payload) {
        const product = this.extractProductData(payload);

        const result = await this.Product.findOneAndUpdate(
            product,
            { $set: { outstanding: false } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            //Bieu thuc chinh quy khong phan biet hoa thuong de so sanh voi du lieu trong database
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const dataUpdate = this.extractProductData(payload);

        const result = await this.Product.findOneAndUpdate(
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

        return await this.Product.findOneAndDelete(filter);
    }
}

export default ProductService;
