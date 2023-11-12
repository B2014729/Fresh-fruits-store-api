import { ObjectId } from "mongodb";
import MongoDB from "../configs/mongoDBConfig.js";

class ConsumerService {
    constructor() {
        this.Consumer = (MongoDB.client).db().collection('consumers');
    }

    extractConsumerData(payload) {
        const consumer = {
            fullname: payload.fullname,
            phone: payload.phone,
            address: payload.address,
            email: payload.email,
            password: payload.password,
        }

        Object.keys(consumer).forEach(
            (key) => consumer[key] === undefined && delete consumer[key]
        )

        return consumer;
    }


    async create(payload) {
        const consumer = this.extractConsumerData(payload);
        const result = await this.Consumer.findOneAndUpdate(
            consumer,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result._id;
    }

    async find(filter) {
        const cursor = await this.Consumer.find(filter);
        return await cursor.toArray();
    }

    async findByName(fullname) {
        return await this.find({
            //Bieu thuc chinh quy khong phan biet hoa thuong de so sanh voi du lieu trong database
            fullname: { $regex: new RegExp(fullname), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Consumer.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const dataUpdate = this.extractConsumerData(payload);

        const result = await this.Consumer.findOneAndUpdate(
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

        return await this.Consumer.findOneAndDelete(filter);
    }
}

export default ConsumerService;