import { request, response } from 'express';
import ProductService from '../services/product.service.js';

const jsonStatus = (statusCode, message, data = []) => {
    return {
        statusCode: statusCode,
        message: message,
        data: data,
    }
}

const createProduct = async (request, response, next) => {
    if (!request.body.data.name) {
        return response.status(400).json(
            jsonStatus(400, 'Name cannot be empty!')
        )
    }
    try {
        const productService = new ProductService();
        const document = await productService.create(request.body.data);
        return response.status(200).json(
            jsonStatus(200, 'Create product successfully!')
        )
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, "An error occurred while creating the Product!")
        );
    }
}


const findAll = async (request, response, next) => {
    let documents = [];
    try {
        const productService = new ProductService();
        documents = await productService.find({});
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, "An error occurred while retrieving the Product!")
        );
    }
    return response.status(200).json(
        jsonStatus(200, 'Get all products successfully!', documents)
    );
}

const findOneByNameOrId = async (require, response, next) => {
    let filter = require.params.filter;
    try {
        const productService = new ProductService();
        let document = await productService.findById(filter);
        if (document) {
            return response.status(200).json(
                jsonStatus(200, "Find product with id successfully!", document)
            )
        } else {
            document = await productService.findByName(filter);
        }

        if (document.length == 0) {
            return response.status(404).json(
                jsonStatus(404, "Product not found")
            )
        }
        return response.status(200).json(
            jsonStatus(200, "Find product with name successfully!", document)
        )
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving Product with id = ${require.params.filter}!`, document)
        )
    }
}

const findIsOutstanding = async (request, response, next) => {
    let documents = [];
    try {
        const productService = new ProductService();
        documents = await productService.find({ outstanding: true });
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, "An error occurred while retrieving the Product!")
        );
    }
    return response.status(200).json(
        jsonStatus(200, 'Get all products successfully!', documents)
    );
}

const findProductWithType = async (request, response, next) => {
    let documents = [];
    try {
        const productService = new ProductService();
        documents = await productService.find({ type: request.params.type });
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, "An error occurred while retrieving the Product!")
        );
    }
    return response.status(200).json(
        jsonStatus(200, 'Get all products successfully!', documents)
    );

}

const updateProduct = async (require, response, next) => {
    if (Object.keys(require.body).length === 0) {
        return response.status(400).json(
            jsonStatus(400, "Data to update cannot be empty!")
        )
    }

    try {
        const productService = new ProductService();
        const document = await productService.update(require.params.filter, require.body.data);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, "Product not found!")
            )
        }
        return response.status(200).json(
            jsonStatus(200, "Product was updated successfully!")
        )
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving Product with id = ${require.params.filter}!`)
        )
    }
}


const deleteProduct = async (require, response, next) => {
    try {
        const productService = new ProductService();
        const document = await productService.delete(require.params.filter);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, "Product not found!")
            )
        }
        return response.status(200).json(
            jsonStatus(200, "Product was deleted successfully!")
        )
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving Product with id = ${require.params.filter}!`)
        )
    }
}

export {
    createProduct,
    findAll,
    findOneByNameOrId,
    findIsOutstanding,
    findProductWithType,
    updateProduct,
    deleteProduct
}