const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", cookieOptions);
};

const clearAccessTokenCookie = (res) => {
  res.clearCookie("accessToken", cookieOptions);
};

module.exports = { setAccessTokenCookie, setRefreshTokenCookie, clearRefreshCookie, clearAccessTokenCookie };
