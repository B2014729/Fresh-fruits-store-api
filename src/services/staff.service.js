import { ObjectId } from 'mongodb';
import MongoDB from '../configs/mongoDBConfig.js';

class StaffService {
    constructor() {
        this.Staff = (MongoDB.client).db().collection("staffs");
    }

    extractStaffData(payload) {
        const staff = {
            fullname: payload.fullname,
            birthday: payload.birthday,
            position: payload.position,
            phone: payload.phone,
            address: payload.address,
            email: payload.email,
            password: payload.password,
        }

        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );

        return staff;
    }

    async create(payload) {
        const staff = this.extractStaffData(payload);

        const result = await this.Staff.findOneAndUpdate(
            staff,
            { $set: {} },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Staff.find(filter);
        return await cursor.toArray();
    }

    async findByName(fullname) {
        return await this.find({
            //Bieu thuc chinh quy khong phan biet hoa thuong de so sanh voi du lieu trong database
            fullname: { $regex: new RegExp(fullname), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Staff.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const dataUpdate = this.extractStaffData(payload);

        const result = await this.Staff.findOneAndUpdate(
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

        return await this.Staff.findOneAndDelete(filter);
    }
}

export default StaffService;
