const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = (req, res, next) => {
  try {
    let token = null;

    // Try Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fall back to cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_ACCESS_TOKEN",
        message: "Please login first",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtAccessKey);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          code: "ACCESS_TOKEN_EXPIRED",
          message: "Access token expired",
        });
      }
      return res.status(401).json({
        success: false,
        code: "INVALID_ACCESS_TOKEN",
        message: "Invalid access token",
      });
    }

    if (!decoded) {
      return res.status(401).json({
        success: false,
        code: "INVALID_ACCESS_TOKEN",
        message: "Invalid access token",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, jwtAccessKey);
        if (decoded) {
          return res.status(400).json({
            success: false,
            message: "User is already logged in.",
          });
        }
      } catch {
        // Token is expired or invalid — treat as logged out, allow login
      }
    }

    next();
  } catch (error) {
    next();
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not an admin",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not a super admin",
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin, isSuperAdmin };
