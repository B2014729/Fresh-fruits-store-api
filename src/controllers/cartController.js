import CartService from "../services/cart.service.js";
import jwt from 'jsonwebtoken';

const jsonStatus = (statusCode, message, data = []) => {
    return {
        statusCode: statusCode,
        message: message,
        data: data,
    }
}

const decodeToken = (token) => {
    const data = jwt.verify(token, "privateKeyHastToken");
    return data.userId;
}


const findOneById = async (request, response, next) => {
    const filter = request.params.idUser;
    const idUser = decodeToken(filter);
    try {
        const cartService = new CartService();
        let document = await cartService.findById(idUser);

        if (document.length == 0) {
            return response.status(404).json(
                jsonStatus(404, 'Cart not found!')
            );
        }
        return response.send(document);
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving cart with id = ${idUser}!`)
        );
    }
}

const updateCart = async (request, response, next) => {
    if (Object.keys(request.body).length === 0) {
        return response.status(400).json(
            jsonStatus(400, 'Data to update cannot be empty!')
        );
    }

    let productAdd = request.body;
    // { structe produtctAdd
    //     idProduct: '',
    //     quantity: 1
    // }
    try {
        const cartService = new CartService();

        const idUser = decodeToken(request.params.idUser)

        let cart = await cartService.findById(idUser);
        let listProduct = cart.products;
        let issetProductInCart = false;
        listProduct.forEach(product => {
            if (product.idProduct === productAdd.idProduct) {
                issetProductInCart = true;
                product.quantity += productAdd.quantity;
            }
        });
        if (!issetProductInCart) {
            listProduct.push(productAdd);
        }
        cart.products = listProduct;

        const document = await cartService.update(idUser, cart);

        if (!document) {
            return response.status(404).json(
                jsonStatus(404, 'Cart not found!')
            );
        }
        return response.status(200).json(
            jsonStatus(200, 'Add product successfuly!')
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving consumer with id = ${idUser}!`)
        );
    }
}

const deleteProductInCart = async (request, response, next) => {

    const idUser = decodeToken(request.params.idUser);
    const idProduct = request.body.idProduct;

    try {
        const cartService = new CartService();
        let cart = await cartService.findById(idUser);
        //Lấy thông tin giỏ hàng hiện tại
        let listProduct = cart.products;
        let newListProductUpdate = [];
        //Cập nhật thông tin mới cho danh sách sản phẩm trong giỏ hàng
        listProduct.forEach(product => {
            if (product.idProduct !== idProduct) {
                newListProductUpdate.push(product);
            }
        });

        cart.products = newListProductUpdate;

        //Cập nhật giỏ hàng
        const document = await cartService.update(idUser, cart);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, 'Cart not found!')
            );
        }
        return response.status(200).json(
            jsonStatus(200, 'Delete product successfuly!')
        );
    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving consumer with id = ${idUser}!`)
        );
    }
}

const resetCart = async (request, response, next) => {
    const cartEmpty = {
        products: []
    };
    try {
        const idUser = decodeToken(request.params.idUser);
        const cartService = new CartService();

        const document = await cartService.update(idUser, cartEmpty);
        if (!document) {
            return response.status(404).json(
                jsonStatus(404, `Cart not found!`)
            );
        }
        return response.status(200).json(
            jsonStatus(200, "Cart was reset successfully!")
        );

    } catch (error) {
        console.log(error);
        return response.status(500).json(
            jsonStatus(500, `Error retrieving cart with idComsumer = ${idUser}!`)
        );
    }
}


export {
    findOneById,
    updateCart,
    deleteProductInCart,
    resetCart,
}
