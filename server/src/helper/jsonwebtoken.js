const jwt = require('jsonwebtoken');
const createJSONWebToken = (payload, secretKey, expiresIn) => {

    if (typeof payload !== "object" || !payload) throw new Error("payload must be an object");
    if (typeof secretKey !== "string" || secretKey === "") throw new Error("secretKey must be a string");

    try {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token
    } catch (error) {
        console.error("Failed to sign JWT", error);
        throw error
    }

}



module.exports = { createJSONWebToken }