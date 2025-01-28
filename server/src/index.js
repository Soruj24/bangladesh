const app = require("./app");
const connectDB = require("./config/db");
const { port } = require("./secret");
 
app.listen(port, async() => {
    await connectDB()
    console.log(`Server is running on port ${port}`);
});
