const { validationResult } = require("express-validator");


const runValidation = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: errors.array()[0].msg
            })
           
        }
        return next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
         
    }
}



module.exports = { runValidation }