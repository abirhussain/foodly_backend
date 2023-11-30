const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const User = require("../models/User");

module.exports = {
  createUser: async (req, res) => {
    const { userName, email, password } = req.body;
    try {
      const user = await admin.auth().getUserByEmail(email);
      if (user.code === "auth/user-not-found") {
        try {
          const userResponse = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            disabled: false,
          });
          console.log(userResponse.uid);

          const newUser = new User({
            username: userName,
            email: email,
            password: CryptoJS.AES.encrypt(
              password,
              process.env.SECRET
            ).toString(),
            uid: userResponse.uid,
            userType: "Client",
          });
          await newUser.save();
          res.status(201).json({ status: true });
        } catch (error) {
          res.status(500).json({ status: false, error: "Error creating user" });
        }
      } else {
        res.status(400).json({ message: "Email already exist" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong. Please try again after sometimes",
      });
    }
  },
  loginUser: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne(
        { email: email },
        { __v: 0, updatedAt: 0, createdAt: 0 }
      );
      !user && res.status(401).json({ message: "Wrong credentials" });
      const decryptedPassword = CryptoJS.AES.decrypt(
        password,
        process.env.SECRET
      );
      const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);
      decrypted !== password &&
        res.status(401).json({ message: "Wrong credentials" });
      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "21d" }
      );

      const { password, email, ...others } = user._doc;

      res.status(200).json({ ...others, userToken });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  },
};
