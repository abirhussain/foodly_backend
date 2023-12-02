const Restaurant = require("../models/Restaurant");

module.exports = {
  getRandomRestaurants: async (req, res) => {
    try {
      let randomRestaurant = [];

      if (req.params.code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (!randomRestaurant.length) {
        randomRestaurant = await Restaurant.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (randomRestaurant.length) {
        res.status(200).json(randomRestaurant);
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error finding restaurants " });
    }
  },
  getRestaurant: async (req, res) => {
    const restaurantId = req.params;
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Something went wrong" });
    }
  },
  createRestaurant: async (req, res) => {
    const newRestaurant = new Restaurant(req.body);
    try {
      await newRestaurant.save();
      res
        .status(201)
        .json({ status: true, message: "Restaurant created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error creating restaurant" });
    }
  },
  toggleServiceAvailability: async (req, res) => {
    const restaurantId = req.params;
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        restaurant.isAvailable = !restaurant.isAvailable;
        await restaurant.save();
        res.status(200).json({
          status: true,
          message: "Availability toggled successfully",
          isAvailable: restaurant.isAvailable,
        });
      } else {
        return res
          .status(403)
          .json({ status: false, message: "Restaurant not found" });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error toggling restaurant avilability",
        error: error.message,
      });
    }
  },
  deleteRestaurant: async (req, res) => {
    const restaurantId = req.params;
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        await Restaurant.findOneAndDelete(restaurantId);
        res
          .status(200)
          .json({ status: true, message: "Restaurant deleted successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error delating restaurant" });
    }
  },
};
