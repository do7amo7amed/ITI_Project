//src/routes/resourceRoutes.js
const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");
const upload = require("../middlewares/uploads");

const {createResourceSchema,updateResourceSchema} = require("../validators/resourcesSchema");
const validate = require("../middlewares/validator");
const  {auth,authorize}  = require("../middlewares");


router.route("/")
.get(resourceController.getAllResources)
.post(auth,authorize('admin'),upload.single("file"),validate(createResourceSchema), resourceController.createResource);
router.route("/:id")
.get(resourceController.getSingleResource)
.put( auth,authorize('admin'),upload.single("file"),validate(updateResourceSchema),resourceController.updateResource)
.delete(auth, authorize('admin'), resourceController.deleteResource);

module.exports = router;
