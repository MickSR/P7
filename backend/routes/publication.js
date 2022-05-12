const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const publicationCtrl = require("../controllers/publicationsCtrl");
const multer = require("../middleware/multer");

router.get("/", publicationCtrl.findAllPublications);
router.get("/users/:id", publicationCtrl.findAllPublicationsForOne);
router.get("/:id", publicationCtrl.findOnePublication);
router.post("/", multer.single("image"), publicationCtrl.createPublication);
router.put("/:id",auth,multer.single("image"),publicationCtrl.modifyPublication);
router.delete("/:id", auth, publicationCtrl.deletePublication);

module.exports = router;
