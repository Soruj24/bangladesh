const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const protectRoute = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({
                message: "Access token not found"
            })
        }

        const decoded = jwt.verify(accessToken, jwtAccessKey);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid access token"
            })
        }

        next();

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "User is not logged in"
        })
    }
}


module.exports = protectRoute