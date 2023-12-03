const router = require("express").Router();
const foodController = require("../controllers/foodController");
const { verifyVendor } = require("../middleware/authMiddleware");

router.post("/", verifyVendor, foodController.addFood);
router.post("/tags/:id", verifyVendor, foodController.addFoodTag);
router.post("/type/:id", verifyVendor, foodController.addFoodType);
router.get("/:id", foodController.getFoodById);
router.get("/:category/:code", foodController.getRandomFoodsByCategoryAndCode);
router.delete("/:id", verifyVendor, foodController.deleteFoodById);
router.patch("/:id", verifyVendor, foodController.toggleFoodAvailability);
router.get("/restaurant/:restaurantId", foodController.getFoodByRestaurant);

module.exports = router;
