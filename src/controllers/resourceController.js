//src/controllers/resourceController.js
const Resource = require("../models/resourcesModel");
const Course = require("../models/courseModel");
const {responseHandler} = require("../utils/responseHandler");
const cloudinary = require("../services/cloudinary");
const {escapeRegExp} = require("../utils");
const {parseSort, parsePagination} = require("../utils/queryHelpers");
const {resourceTypes, sourceTypes} = require("../validators/resourcesSchema");

const ALLOWED_SORT_FIELDS = ["createdAt", "downloadCount", "title"];

const createResource = async (req, res, next) => { // Create Resource
    try {
        const {title, description, type, sourceType, externalUrl, course} = req.body;
        const courseExists = await Course.findOne({ courseCode: course.toUpperCase() });

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

        const fileUrl = req.file? `/uploads/resources/${req.file.filename}`: null; //disk
        //const fileUrl = req.file ? req.file.path : undefined; //cloudinary
        const cloudinaryPublicId = req.file ? req.file.filename : undefined;
        const newResource = await Resource.create({
            title, description, type, sourceType, externalUrl, course:courseExists._id, fileUrl,cloudinaryPublicId,uploadedBy: req.user._id
        });
        return responseHandler(res, 201, "New Resource Created Successfully", newResource);

    } catch (err) {
        next(err);
    }
}

const getAllResources = async (req, res, next) => { // Get All Resources (search, filter, sort, paginate)
    try {
        const {
          search,
          course,
          level,
          semester,
          type,
          sourceType,
          sort,
          page = 1,
          limit = 10,
        } = req.query;

        // ---- Validate enum filters up front ----
        if (type && !resourceTypes.includes(type)) {
          return responseHandler(
            res,
            400,
            `Invalid resource type. Allowed values: ${resourceTypes.join(", ")}`
          );
        }

        if (sourceType && !sourceTypes.includes(sourceType)) {
          return responseHandler(
            res,
            400,
            `Invalid sourceType. Allowed values: ${sourceTypes.join(", ")}`
          );
        }

        const { pageNum, limitNum, skip } = parsePagination(page, limit);
        const sortStage = parseSort(sort, ALLOWED_SORT_FIELDS, { createdAt: -1 });

        // ---- Match stage on the Resource collection itself ----
        const matchStage = {};

        if (search) {
          const safeSearch = escapeRegExp(search);
          matchStage.$or = [
            { title: { $regex: safeSearch, $options: "i" } },
            { description: { $regex: safeSearch, $options: "i" } },
          ];
        }

        if (type) matchStage.type = type;
        if (sourceType) matchStage.sourceType = sourceType;

        // ---- Match stage on the joined Course info ----
        // course/level/semester live on Course, not Resource, so we $lookup
        // the course first and filter on the joined fields.
        const courseMatchStage = {};
        if (course) courseMatchStage["courseInfo.courseCode"] = course.toUpperCase();
        if (level) courseMatchStage["courseInfo.academicLevel"] = level;
        if (semester) courseMatchStage["courseInfo.semester"] = semester;

        const pipeline = [
          { $match: matchStage },
          {
            $lookup: {
              from: "courses",
              localField: "course",
              foreignField: "_id",
              as: "courseInfo",
            },
          },
          { $unwind: "$courseInfo" },
          ...(Object.keys(courseMatchStage).length ? [{ $match: courseMatchStage }] : []),
          {
            $lookup: {
              from: "users",
              localField: "uploadedBy",
              foreignField: "_id",
              as: "uploaderInfo",
            },
          },
          { $unwind: { path: "$uploaderInfo", preserveNullAndEmptyArrays: true } },
          { $sort: sortStage },
          {
            $facet: {
              data: [
                { $skip: skip },
                { $limit: limitNum },
                {
                  $project: {
                    title: 1,
                    description: 1,
                    type: 1,
                    sourceType: 1,
                    fileUrl: 1,
                    externalUrl: 1,
                    downloadCount: 1,
                    createdAt: 1,
                    course: {
                      _id: "$courseInfo._id",
                      courseName: "$courseInfo.courseName",
                      courseCode: "$courseInfo.courseCode",
                      academicLevel: "$courseInfo.academicLevel",
                      semester: "$courseInfo.semester",
                    },
                    uploadedBy: {
                      _id: "$uploaderInfo._id",
                      name: "$uploaderInfo.name",
                      email: "$uploaderInfo.email",
                      role: "$uploaderInfo.role",
                    },
                  },
                },
              ],
              totalCount: [{ $count: "count" }],
            },
          },
        ];

        const result = await Resource.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
        const totalPages = Math.ceil(total / limitNum) || 0;

        return responseHandler(res, 200, "Resources Found", {
          count: data.length,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          resources: data,
        });

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
