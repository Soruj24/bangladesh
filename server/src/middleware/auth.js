const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: " Please Login first",
      });
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "user not verified",
      });
    }
    console.log("decoded", decoded.userExists);
    //! isAdmin Check
    req.user = decoded.userExists;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "user not verified",
    });
  }
};
const isLoggedOut = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtAccessKey);
        if (decoded) {
          return res.status(400).json({
            success: false,
            message: "User is already logged in.",
          });
        }
      } catch (error) {
        console.log("error", error);
        return res.status(400).json({
          success: false,
          message: "User is already logged in.",
        });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "User is already logged in.",
    });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "You are not an admin",
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not a super admin",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "You are not a super admin",
    });
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin, isSuperAdmin };
