const { createJSONWebToken } = require("../helper/jsonwebtoken")
const User = require("../model/userModel")
const bcrypt = require("bcryptjs")
const { jwtAccessKey, jwtRefreshKey } = require("../secret")
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie")
const jwt = require('jsonwebtoken')

const handelLogIn = async (req, res, next) => {
    try {
        // email.password
        const { email, password } = req.body
        // isExists
        const userExists = await User.findOne({ email })
        if (!userExists) {
            return res.status(404).json({
                message: "User dose not exist with this email"
            })
        }
        // compare the password
        const isMatch = await bcrypt.compare(password, userExists.password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Password does not match"
            })
        }

        const accessToken = createJSONWebToken({ userExists },
            jwtAccessKey,
            "15m")
        const refreshToken = createJSONWebToken({ userExists },
            jwtRefreshKey,
            "7d")

        setAccessTokenCookie(res, accessToken)
        setRefreshTokenCookie(res, refreshToken)


        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email,
                isAdmin: userExists.isAdmin,
                isSuperAdmin: userExists.isSuperAdmin,
                accessToken,
                refreshToken
            }
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "user login failed"
        })
    }
}

const handelRefreshToken = async (req, res, next) => {
    try {

        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            })
        }

        const decoded = jwt.verify(oldRefreshToken, jwtRefreshKey);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }

        const accessToken = createJSONWebToken({ userExists: decoded.userExists },
            jwtAccessKey,
            "15m")

        setAccessTokenCookie(res, accessToken)


        return res.status(201).json({
            message: "new access token created successfully",
            accessToken
        })


    } catch (error) {
        console.log(error)
    }
}



const handelProtected = async (req, res, next) => {
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

        const user = await User.find({})

        return res.status(201).json({
            message: "Protected route accessed successfully",
            user
        })


    } catch (error) {
        console.log(error)
    }
}


const handelLogOut = async (req, res, next) => {
    try {

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        return res.status(200).json({
            message: "User logout  successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "user logout failed"
        })
    }
}


module.exports = {
    handelLogIn,
    handelLogOut,
    handelRefreshToken,
    handelProtected
}