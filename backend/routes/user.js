const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/usersCtrl");
const multer = require("../middleware/multer");
const auth = require("../middleware/auth");

router.get("/:id", userCtrl.GetProfile);
router.put("/:id", auth, multer.single("profil_image"), userCtrl.modifyUser);
router.delete("/", auth, userCtrl.deleteOneUser);
router.delete("/:id", auth, userCtrl.deleteMyAccount);
router.post("/logout", userCtrl.logout);

module.exports = router;
