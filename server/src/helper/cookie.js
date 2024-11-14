const setAccessTokenCookie = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // days
        httpOnly: true,
        sameSite: "none",
        secure: true
    });
}


module.exports = { setAccessTokenCookie }