const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/commentsCtrl");
const auth = require("../middleware/auth");

router.get("/publications", commentCtrl.findAllComments);
router.get("/:id", commentCtrl.findOneComment);
router.post("/", auth, commentCtrl.createComment);
router.delete("/:id", auth, commentCtrl.deleteComment);

module.exports = router;
