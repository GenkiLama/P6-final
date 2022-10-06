const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const multer = require("../middleware/multer");
const { hasPermission } = require("../middleware/permission");
const {
  createSauceInputValidator,
  editSauceInputValidator,
} = require("../middleware/inputValidator");
const {
  getSauces,
  getSauce,
  createSauce,
  editSauce,
  likeSauce,
  deleteSauce,
} = require("../controllers/saucesController");

router.get("/", auth, getSauces);
router.get("/:id", auth, getSauce);
router.post("/", auth, multer, createSauceInputValidator, createSauce);
router.post("/:id/like", auth, likeSauce);
router.put(
  "/:id",
  auth,
  hasPermission,
  multer,
  editSauceInputValidator,
  editSauce
);
router.delete("/:id", auth, hasPermission, deleteSauce);

module.exports = router;
