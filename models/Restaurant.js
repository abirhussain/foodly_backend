const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    foods: { type: Array },
    pickup: { type: Boolean, required: true, default: true },
    delivery: { type: Boolean, required: true, default: true },
    isAvailable: { type: Boolean, default: true },
    owner: { type: String, required: true },
    code: { type: String, required: true },
    logoUrl: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/dq2o7kdrp/image/upload/v1701544840/restaurant_kibweh.jpg",
    },
    rating: { type: Number, min: 1, max: 5 },
    ratingCount: { type: String },
    coords: {
      id: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Nubmer, required: true },
      latitudeDelta: { type: Number, required: true },
      longitudeDelta: { type: Number, required: true },
      address: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
