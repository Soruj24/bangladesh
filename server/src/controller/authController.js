const { createJSONWebToken } = require("../helper/jsonwebtoken")
const User = require("../model/userModel")
const bcrypt = require("bcryptjs")
const { jwtAccessKey } = require("../secret")
const { setAccessTokenCookie } = require("../helper/cookie")

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

        setAccessTokenCookie(res, accessToken)

        const user = userExists.toObject();
        delete user.password;

        res.status(200).json({
            message: "User logged in successfully",
            user,
            accessToken
        })


    } catch (error) {
        return res.status(500).json({
            message: "user login failed"
        })
    }
}

const handelLogOut = async (req, res, next) => {
    try {

        res.clearCookie("accessToken")

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

module.exports = { handelLogIn, handelLogOut }