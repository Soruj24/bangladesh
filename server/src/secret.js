require('dotenv').config()

const jwtAccessKey = process.env.JWT_ACCESS_KEY || "dev-access-key-CHANGE-IN-PRODUCTION"
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "dev-refresh-key-CHANGE-IN-PRODUCTION"
const cloud_name = process.env.CLOUD_NAME || ""
const cloud_api_key = process.env.CLOUD_API_KEY || ""
const cloud_api_secret = process.env.CLOUD_API_SECRET || ""
const mongodb_url = process.env.MONGODB_URL || ""
const port = process.env.PORT || 4000
const nodeEnv = process.env.NODE_ENV || "development"
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"

module.exports = { port, jwtAccessKey, jwtRefreshKey, cloud_name, cloud_api_key, cloud_api_secret, mongodb_url, nodeEnv, frontendUrl }
