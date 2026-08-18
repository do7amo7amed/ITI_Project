const express = require("express");
const router = express.Router();
const resourseController = require("../controllers/resourceController");

router.route("/").post(resourseController.createResourse);
router.route("/:id")
.get(resourseController.readResource)
.put(resourseController.updateResource)
.delete(resourseController.deleteResource);

module.exports = router;