import ApiError from '../api-error.js';

import StaffService from '../services/staff.service.js';

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
        return next(
            new ApiError(500, "An error occurred while retrieving Staffs!")
        )
    }
    return response.send(documents);
}

const findOneByNameOrId = async (require, response, next) => {
    let filter = require.params.filter;
    try {
        const staffService = new StaffService();
        let document = await staffService.findById(filter);
        if (document) {
            return response.send(document);
        } else {
            document = await staffService.findByName(filter);
        }

        if (document.length == 0) {
            return next(new ApiError(404, "Staff not found"));
        }

        return response.send(document);
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

export {
    createStaff,
    findAll,
    findOneByNameOrId,
    updateStaff,
    deleteStaff
}