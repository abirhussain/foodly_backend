const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const User = require("../models/User");

module.exports = {
  createUser: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      await admin.auth().getUserByEmail(email);
      res.status(400).json({ message: "Email already exist" });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        try {
          const userResponse = await admin.auth().createUser({
            email: email,
            password: password,
            emailVerified: false,
            disabled: false,
          });

          const newUser = new User({
            userName: username,
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
          res.status(500).json({
            status: false,
            error: "Error creating user",
          });
        }
      } else {
        res.status(422).json({
          message: "missing information",
        });
      }
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { email: req.body.email },
        { __v: 0, updatedAt: 0, createdAt: 0 }
      );

      if (user) {
        const decryptedpassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.SECRET
        );

        if (
          decryptedpassword.toString(CryptoJS.enc.Utf8) != req.body.password
        ) {
          res.status(401).json("Wrong password");
        } else {
          const userToken = jwt.sign(
            {
              id: user._id,
              userType: user.userType,
              email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "21d" }
          );

          const { password, email, ...others } = await user._doc;
          res.status(200).json({ ...others, userToken });
        }
      } else {
        res.status(401).json("Wrong credentials");
      }
    } catch (error) {
      res.status(500).json({ status: false, err: error.message });
    }
  },
};
