import ApiError from "../api-error.js";
import ConsumerService from "../services/consumer.service.js";
import CartService from "../services/cart.service.js";
import jwt from 'jsonwebtoken';

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
        const consumerService = new ConsumerService();
        const document = await consumerService.find(filter);
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

const createConsumer = async (request, response, next) => {
    if (!request.body.email) {
        return response.status(400).json(
            jsonStatus(400, 'Email cannot be empty!')
        );
    }
    try {
        const consumerService = new ConsumerService();
        const cartService = new CartService();

        const document = await consumerService.create(request.body);
        let payload = {
            idConsumer: document,
            products: [],
        }
        await cartService.create(payload);

        return response.status(200).json(
            jsonStatus(200, 'Create consumer successfully!')
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, 'An error occurred while creating the consumer!')
        );
    }
}

const findAll = async (request, response, next) => {
    let documents = [];
    try {
        const consumerService = new ConsumerService();
        documents = await consumerService.find({});
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, 'An error occurred while retrieving consumers!')
        );
    }
    return response.status(200).json(
        jsonStatus(200, 'Get all consumer successfully!', documents)
    );
}

const findOneById = async (request, response, next) => {
    try {
        let idConsumer = decodeToken(request.params.filter);
        const consumerService = new ConsumerService();
        let document = await consumerService.findById(idConsumer);
        if (document) {
            delete document._id;
            delete document.password;

            return response.status(200).json(
                jsonStatus(200, 'Find one with id successfuly!', document)
            );
        }
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, 'Consumer not found!')
            );
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving consumer with id = ${request.params.filter} !`)
        );
    }
}

//find with email, fullname
const findOne = async (request, response, next) => {
    let filter = request.params.filter;
    try {
        const consumerService = new ConsumerService();
        let document = await consumerService.findByName(filter);
        if (document.length > 0) {
            return response.status(200).json(
                jsonStatus(200, 'Find one with fullname successfuly!', document)
            );
        } else {
            document = await consumerService.find({ email: filter });
            if (document) {
                return response.status(200).json(
                    jsonStatus(200, 'Find one with email successfuly!', document)
                );
            }
        }
        if (document.length == 0) {
            return response.status(404).json(
                jsonStatus(404, 'Consumer not found!')
            );
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving consumer with id = ${request.params.filter} !`)
        );
    }
}

const updateConsumer = async (request, response, next) => {

    const dataUpdate = {
        fullname: request.body.fullname,
        phone: request.body.phone,
        address: request.body.address,
    };

    const idUser = decodeToken(request.params.filter);

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json(
            jsonStatus(400, `Data to update cannot be empty!`)
        );
    }

    try {
        const consumerService = new ConsumerService();
        const document = await consumerService.update(idUser, dataUpdate);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, `Consumer not found!`)
            );
        }

        return response.status(200).json(
            jsonStatus(200, `Consumer was updated successfully!`)
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving consumer with id = ${idUser} !`)
        );
    }
}


const deleteConsumer = async (request, response, next) => {
    try {
        const consumerService = new ConsumerService();
        const cartService = new CartService();
        const consumer = await consumerService.findById(request.params.filter);

        if (!consumer) {
            return next(new ApiError(404, "Consumer not found!"));
        } else {
            await consumerService.delete(request.params.filter);
            await cartService.delete(consumer._id);
        }
        return response.send({ message: "Consumer was deleted successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving consumer with id = ${request.params.filter} !`)
        )
    }
}

export {
    createConsumer,
    findAll,
    findOne,
    findOneById,
    updateConsumer,
    deleteConsumer,
    login
}
