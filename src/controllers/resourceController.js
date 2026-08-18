const Resource = require("../models/resourcesModel");
const responeHandler = require("../utils/responseHandler");


const createResource = async (req, res, next) => { // Create Resource
    try {
        const {title, description, type, sourceType, fileUrl, externalUrl, course} = req.body;

        const newResource = await Resource.create({
            title, description, type, sourceType, fileUrl, externalUrl, course, uploadedBy: req.user._id
        });
    
        return responeHandler(res, 201, "New Resource Created Successfully", newResource);
        
    } catch (err) {
        next(err);
    }
}

const readResource = async (req, res, next) => { // Read Resource
    try {
        const resource = await Resource.findById(req.params.id);

        if(!resource) {
            return responeHandler(res, 404, "Resource Not Found!");
        }

        return responeHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}

const updateResource = async (req, res, next) => { // Update Resource
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!resource) {
            return responeHandler(res, 404, "Resource Not Found!");
        }

        return responeHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}

const deleteResource = async (req, res, next) => { // Delete Resource
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if(!resource) {
            return responeHandler(res, 404, "Resource Not Found!");
        }

        return responeHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}