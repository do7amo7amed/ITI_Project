const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

const {createResourceSchema,updateResourceSchema} = require("../validators/resourcesSchema");
const {validate} = require("../middlewares/validator");

router.route("/")
.get(resourceController.getAllResources)
.post(validate(createResourceSchema), resourceController.createResource);
router.route("/:id")
.get(resourceController.getSingleResource)
.put( validate(updateResourceSchema),resourceController.updateResource)
.delete(resourceController.deleteResource);

module.exports = router;