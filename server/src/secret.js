require('dotenv').config()

const jwtAccessKey = process.env.JWT_ACCESS_KEY || "ut5876458645tuy9345867458tuy4589yt5"
const jwtRefreshKey = process.env.ACCESS_TOKEN_SECRET || "ut5876458645tuy9345867458tuy4589yt5"
const cloud_name = process.env.CLOUD_NAME || "ut5876458645tuy9345867458tuy4589yt5"
const cloud_api_key = process.env.CLOUD_API_KEY || "ut5876458645tuy9345867458tuy4589yt5"
const cloud_api_secret = process.env.CLOUD_API_SECRET || "ut5876458645tuy9345867458tuy4589yt5"
const mongodb_url = process.env.MONGODB_URL || ""


module.exports = { jwtAccessKey, jwtRefreshKey, cloud_name, cloud_api_key, cloud_api_secret, mongodb_url }