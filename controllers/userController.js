const User = require("../models/User");

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(
        { _id: userId },
        {
          password: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      );
      res.status(200).json(User);
    } catch (error) {
      res
        .satus(500)
        .json({ message: "error retrieving user", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;
    try {
      await User.findByIdAndDelete(userId);
      res
        .status(204)
        .json({ status: true, message: "user deleted successfully" });
    } catch (error) {
      res.satus(500).json({ message: "error deleting user" });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.user.id;
    try {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res
        .status(204)
        .json({ status: true, message: "user updated successfully" });
    } catch (error) {
      res.satus(500).json({ message: "error updating user" });
    }
  },
};
