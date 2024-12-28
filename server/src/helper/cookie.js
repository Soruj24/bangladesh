const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,      // Prevents client-side JavaScript from accessing the token
        secure: process.env.NODE_ENV === 'production', // Ensure it's sent only over HTTPS in production
        maxAge: 3 * 1000, // 15 minutes
        sameSite: 'Strict',  // Prevents sending cookies with cross-site requests
    });
};

// Set the refresh token cookie
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,      // Prevents client-side JavaScript from accessing the token
        secure: process.env.NODE_ENV === 'production', // Ensure it's sent only over HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
        sameSite: 'Strict',  // Prevents sending cookies with cross-site requests
    });
};



module.exports = { setAccessTokenCookie,setRefreshTokenCookie }