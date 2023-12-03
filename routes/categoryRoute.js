const router = require("express").Router();
const categoryControlller = require("../controllers/categoryController");
const { verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", categoryControlller.getAllCategories);
router.get("/random", categoryControlller.getRandomCategories);
router.post("/", verifyAdmin, categoryControlller.createCategory);
router.put("/:id", verifyAdmin, categoryControlller.updateCategory);
router.post("/image/:id", verifyAdmin, categoryControlller.updateCategoryImage);
router.delete("/:id", verifyAdmin, categoryControlller.deleteCategory);

module.exports = router;
