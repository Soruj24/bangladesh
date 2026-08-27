const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const divisionRoutes = require("./router/divisionRoutes");
const districtRoutes = require("./router/districtRoutes");
const upazilaRoutes = require("./router/upazilaRoutes");
const unionRoutes = require("./router/unionRoutes");
const villageRoutes = require("./router/villageRoutes");
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter");
const populationRoute = require("./router/populationRoute");
const publicRouter = require("./router/publicRouter");
const { errorResponse } = require("./controller/responesController");
const { frontendUrl } = require("./secret");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: frontendUrl,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/public", publicRouter);

app.use("/api/unions", unionRoutes);
app.use("/api/users", userRouter);
app.use("/api/population", populationRoute);
app.use("/api/auth", authRouter);
app.use("/api/divisions", divisionRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/upazilas", upazilaRoutes);
app.use("/api/villages", villageRoutes);

// route error handler
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// server error handler
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
