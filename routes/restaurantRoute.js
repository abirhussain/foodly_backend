const router = require("express").Router();

const restaurantController = require("../controllers/restaurantController");
const {
  verifyAuthorization,
  verifyVendor,
} = require("../middleware/authMiddleware");

router.post("/", verifyAuthorization, restaurantController.createRestaurant);
router.get("/:id", restaurantController.getRestaurant);
router.get("/:code", restaurantController.getRandomRestaurants);
router.patch(
  "/:id",
  verifyVendor,
  restaurantController.toggleServiceAvailability
);
router.delete("/:id", verifyVendor, restaurantController.deleteRestaurant);

module.exports = router;
