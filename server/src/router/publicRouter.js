const { getPublicStats, getPublicDivisions } = require("../controller/publicController");

const publicRouter = require("express").Router();

publicRouter.get("/stats", getPublicStats);
publicRouter.get("/divisions", getPublicDivisions);

module.exports = publicRouter;
