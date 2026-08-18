const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

const {resourceSchema} = require("../validators/resourcesSchema");
const validate = require("../middlewares/validator");

router.route("/")
.get(resourceController.getAllResources)
.post(validate(resourceSchema), resourceController.createResourse);
router.route("/:id")
.get(resourceController.getSingleResource)
.put(resourceController.updateResource)
.delete(resourceController.deleteResource);

module.exports = router;