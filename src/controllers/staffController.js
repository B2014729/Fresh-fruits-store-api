import ApiError from '../api-error.js';
import jwt from 'jsonwebtoken';
import StaffService from '../services/staff.service.js';

const encodeToken = (id) => {
    return jwt.sign({
        userId: id,
    }, "privateKeyHastToken");
}
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

const createStaff = async (request, response, next) => {
    if (!request.body.fullname) {
        return next(new ApiError(400, 'Fullname cannot be empty!'));
    }
    try {
        const staffService = new StaffService();
        const document = await staffService.create(request.body);
        return response.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the Staff!")
        );
    }
}

const findAll = async (request, response, next) => {
    let documents = [];
    try {
        const staffService = new StaffService();
        documents = await staffService.find({});
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, 'An error occurred while retrieving Staffs!')
        );
    }
    return response.status(200).json(
        jsonStatus(200, 'Get staff list sucessfully!', documents)
    );
}

const findOneByNameOrId = async (require, response, next) => {
    let filter = require.params.filter;

    try {
        const staffService = new StaffService();
        let document = [];
        try {
            const idUser = decodeToken(filter);
            document[0] = await staffService.findById(idUser);//function findByName return a json
        } catch (error) {
            document = await staffService.findByName(filter);//function findByName return a array
        }
        if (!document[0]) {
            return response.status(404).json(
                jsonStatus(404, 'Staff not found!')
            );
        }

        delete document[0]._id;
        delete document[0].password;

        return response.status(200).json(
            jsonStatus(200, 'Get staff sucessfully!', document)
        );
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving Staff with id = ${require.params.filter}!`)
        )
    }
}

const updateStaff = async (require, response, next) => {
    if (Object.keys(require.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty!"));
    }

    try {
        const staffService = new StaffService();
        const document = await staffService.update(require.params.filter, require.body);
        if (!document) {
            return next(new ApiError(404, "Staff not found!"));
        }
        return response.send({ message: "Staff was updated successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving Staff with id = ${require.params.filter}!`)
        )
    }
}


const deleteStaff = async (require, response, next) => {
    try {
        const staffService = new StaffService();
        const document = await staffService.delete(require.params.filter);
        if (!document) {
            return next(new ApiError(404, "Contact not found!"));
        }
        return response.send({ message: "Staff was deleted successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving Staff with id = ${require.params.filter}!`)
        )
    }
}

const login = async (request, response, next) => {
    if (!request.body.email && !request.body.password) {
        return response.status(400).json(
            jsonStatus(400, 'Email and password cannot be empty!')
        );
    }
    const filter = {
        email: request.body.email
    }
    try {
        const staffService = new StaffService();
        const document = await staffService.find(filter);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, 'Consumer not found!')
            );;
        } else {
            if (request.body.password == document[0].password) {
                let token = encodeToken(document[0]._id);
                response.setHeader('user_token', token);
                //response.cookie('jwt', token, { httpOnly: true, expires: new Date(Date.now() + 900000) });
                return response.status(201).json(
                    jsonStatus(201, 'Login successfuly!')
                );
            }
        }
        return response.status(400).json(
            jsonStatus(400, 'Login failed!')
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, 'An error occurred while login the consumer!')
        );
    }
}


export {
    createStaff,
    findAll,
    findOneByNameOrId,
    updateStaff,
    deleteStaff,
    login,
}