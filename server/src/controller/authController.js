const { createJSONWebToken } = require("../helper/jsonwebtoken");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearRefreshCookie,
} = require("../helper/cookie");
const jwt = require("jsonwebtoken");

const handelLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this email",
      });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }

    const accessToken = createJSONWebToken(
      { id: userExists._id, email: userExists.email, isAdmin: userExists.isAdmin, isSuperAdmin: userExists.isSuperAdmin },
      jwtAccessKey,
      "15m"
    );
    const refreshToken = createJSONWebToken(
      { id: userExists._id },
      jwtRefreshKey,
      "7d"
    );

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        isAdmin: userExists.isAdmin,
        isSuperAdmin: userExists.isSuperAdmin,
        accessToken,
      },
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "User login failed",
    });
  }
};

const handelRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, jwtRefreshKey);
    } catch {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    if (!decoded || !decoded.id) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token payload",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = createJSONWebToken(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin },
      jwtAccessKey,
      "15m"
    );

    const newRefreshToken = createJSONWebToken(
      { id: user._id },
      jwtRefreshKey,
      "7d"
    );

    setAccessTokenCookie(res, newAccessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("[AUTH] Refresh error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Token refresh failed",
    });
  }
};

const handelProtected = async (req, res, next) => {
  try {
    const user = await User.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Protected route accessed successfully",
      user,
    });
  } catch (error) {
    console.error("[AUTH] Protected route error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const handelLogOut = async (req, res, next) => {
  try {
    clearRefreshCookie(res);
    res.clearCookie("accessToken");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("[AUTH] Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "User logout failed",
    });
  }
};

module.exports = {
  handelLogIn,
  handelRefreshToken,
  handelProtected,
  handelLogOut,
};
