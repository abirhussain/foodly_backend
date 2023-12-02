const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        res.status(403).json({ status: false, message: "invalid token" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.send();
  }
};

const verifyAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    const userType = req.user.userType;
    if (
      userType === "Client" ||
      userType === "Vendor" ||
      userType === "Driver" ||
      userType === "Admin"
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not authorized" });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    const userType = req.user.userType;
    if (userType === "Vendor" || userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not authorized" });
    }
  });
};

const verifyDriver = (req, res, next) => {
  verifyToken(req, res, () => {
    const userType = req.user.userType;
    if (userType === "Driver" || userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not authorized" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const userType = req.user.userType;
    if (userType === "Admin") {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: "You are not authorized" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAuthorization,
  verifyAdmin,
  verifyVendor,
  verifyDriver,
};
