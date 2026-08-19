const Resource = require("../models/resourcesModel");
const Course = require("../models/courseModel");
const {responseHandler} = require("../utils/responseHandler");
const cloudinary = require("../services/cloudinary");

const createResource = async (req, res, next) => { // Create Resource
    try {
        const {title, description, type, sourceType, externalUrl, course} = req.body;
        const courseExists = await Course.findOne({ courseName: course });

        if (!courseExists) {
          return responseHandler(
            res,
            404,
            "Course not found"
          );
        }

        //validation
        if (sourceType === "pdf" && !req.file) {// PDF resources must have a file
                  return responseHandler(
                    res,
                    400,
                    "PDF file is required"
                  );
                }

                if (sourceType !== "pdf" && req.file) {// Non-PDF resources must not have a file
                  return responseHandler(
                    res,
                    400,
                    "File upload is only allowed for PDF resources"
                  );
                }

        const fileUrl = req.file ? req.file.path : undefined;
        const cloudinaryPublicId = req.file ? req.file.filename : undefined;
        const newResource = await Resource.create({
            title, description, type, sourceType, externalUrl, course:courseExists._id, fileUrl,cloudinaryPublicId,uploadedBy: req.user._id
        });
        return responseHandler(res, 201, "New Resource Created Successfully", newResource);

    } catch (err) {
        next(err);
    }
}

const getAllResources = async (req, res, next) => { // Get All Resources
    try {
        const resource = await Resource.find() .populate("course").populate("uploadedBy", "name email role");;

//        if(!resource) {
//            return responseHandler(res, 404, "Resource Not Found!");
//        }

        return responseHandler(res, 200, "Resources Found", resource);

    } catch (err) {
        next(err);
    }
}

const getSingleResource = async (req, res, next) => { // Get Single Resource
    try {
        const resource = await Resource.findById(req.params.id) .populate("course");

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        return responseHandler(res, 200, "Resource Found", resource);

    } catch (err) {
        next(err);
    }
}

const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return responseHandler(res,404,"Resource Not Found!");
    }

    const {
      title,
      description,
      type,
      sourceType,
      externalUrl,
      course,
    } = req.body;

      const updateData = {};
       if (course !== undefined) {
            const courseExists = await Course.findOne({ courseName: course });

            if (!courseExists) {
              return responseHandler(
                res,
                404,
                "Course not found"
              );
            }
            updateData.course = courseExists._id;
          }


        if (title !== undefined) {
          updateData.title = title;
        }

        if (description !== undefined) {
          updateData.description = description;
        }

        if (type !== undefined) {
          updateData.type = type;
        }

        if (sourceType !== undefined) {
          updateData.sourceType = sourceType;
        }

        const updatedSourceType =sourceType ?? resource.sourceType;
         if (updatedSourceType === "pdf" && !req.file && !resource.fileUrl) {
             return responseHandler(res, 400, "PDF file is required");
         }

         if (updatedSourceType !== "pdf" && req.file) {
             return responseHandler(res,400,"File upload is only allowed for PDF resources");
         }

        if (updatedSourceType === "pdf") {
            if (req.file) {
                // New PDF uploaded

                // Delete old PDF from Cloudinary
                if (resource.cloudinaryPublicId) {
                  await cloudinary.uploader.destroy(
                    resource.cloudinaryPublicId,
                    {
                      resource_type: "raw",
                    }
                  );
                }
                // Save new PDF information
                updateData.fileUrl = req.file.path;
                updateData.cloudinaryPublicId = req.file.filename;

              } else {
                // Keep existing PDF
                updateData.fileUrl = resource.fileUrl;
                updateData.cloudinaryPublicId = resource.cloudinaryPublicId;
              }

              // PDF doesn't need externalUrl
              updateData.externalUrl = undefined;

            }

              else {

                  // If changing from PDF to YouTube/link,
                  // delete the old PDF from Cloudinary
                  if (resource.cloudinaryPublicId) {
                    await cloudinary.uploader.destroy(
                      resource.cloudinaryPublicId,
                      {
                        resource_type: "raw",
                      }
                    );
                  }

                  updateData.fileUrl = undefined;
                  updateData.cloudinaryPublicId = undefined;

                  if (externalUrl !== undefined) {
                    updateData.externalUrl = externalUrl;
                  }
                }

    const updatedResource = await Resource.findByIdAndUpdate(req.params.id,updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return responseHandler(res, 200, "Resource updated successfully", updatedResource );

  } catch (err) {
    next(err);
  }
};

const deleteResource = async (req, res, next) => { // Delete Resource
    try {
        const resource = await Resource.findById(req.params.id);

        if(!resource) {
            return responseHandler(res, 404, "Resource Not Found!");
        }

        // Delete PDF from Cloudinary
            if (resource.cloudinaryPublicId) {
              await cloudinary.uploader.destroy(
                resource.cloudinaryPublicId,
                {
                  resource_type: "raw",
                }
              );
            }

            // Delete resource from MongoDB
            await Resource.findByIdAndDelete(req.params.id);

        return responseHandler(res, 200, "Resource deleted successfully", resource);

    } catch (err) {
        next(err);
    }
}
module.exports = {
    createResource,
    getAllResources,
    getSingleResource,
    updateResource,
    deleteResource
};