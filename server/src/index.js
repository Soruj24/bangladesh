const app = require("./app");
const connectDB = require("./config/db");
const post = 4000;




app.listen(post, async() => {
    await connectDB()
    console.log(`Server is running on port ${post}`);
});
