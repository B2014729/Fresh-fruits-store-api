import { response } from "express";
import CartService from "../services/cart.service.js";

const findOneById = async (request, response, next) => {
    const filter = request.params.filter;
    try {
        const cartService = new CartService();
        let document = await cartService.findById(filter);

        if (document.length == 0) {
            return next(new ApiError(404, "Cart not found"));
        }
        return response.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving cart with id = ${require.params.filter}!`)
        )
    }
}

const updateCart = async (require, response, next) => {
    if (Object.keys(require.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty!"));
    }

    try {
        const cartService = new CartService();
        const document = await cartService.update(require.params.filter, require.body);
        if (!document) {
            return next(new ApiError(404, "Cart not found!"));
        }
        return response.send({ message: "Cart was updated successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving cart with id = ${require.params.filter}!`)
        )
    }
}

const resetCart = async (require, response, next) => {
    const cartEmpty = {
        products: []
    };
    try {
        const cartService = new CartService();
        const document = await cartService.update(require.params.filter, cartEmpty);
        if (!document) {
            return next(new ApiError(404, "Cart not found!"));
        }
        return response.send({ message: "Cart was reset successfully!" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving cart with id = ${require.params.filter}!`)
        )
    }

}


export {
    findOneById,
    updateCart,
    resetCart,
}
