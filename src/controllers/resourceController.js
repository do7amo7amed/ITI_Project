const Resource = require("../models/resourcesModel");
const responseHandler = require("../utils/responseHandler");


const createResource = async (req, res, next) => { // Create Resource
    try {
        const {title, description, type, sourceType, fileUrl, externalUrl, course} = req.body;

        const newResource = await Resource.create({
            title, description, type, sourceType, fileUrl, externalUrl, course, uploadedBy: req.user._id
        });
    
        return responseHandler(res, 201, "New Resource Created Successfully", newResource);
        
    } catch (err) {
        next(err);
    }
}

const getAllResources = async (req, res, next) => { // Get All Resources
    try {
        const resources = await Resource.find();

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        return responseHandler(res, 200, "Resources Found", resources);

    } catch (err) {
        next(err);
    }
}

const getSingleResource = async (req, res, next) => { // Get Single Resource
    try {
        const resource = await Resource.findById(req.params.id);

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        return responseHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}

const updateResource = async (req, res, next) => { // Update Resource
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        return responseHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}

const deleteResource = async (req, res, next) => { // Delete Resource
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        return responseHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}