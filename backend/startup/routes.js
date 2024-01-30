const cors = require("cors");
const express = require("express");



const userRouter = require("../routes/user");
const balanceRouter = require("../routes/accout");

const invalidRoute = require("../middlewares/invalidRoute");
const globalCatch = require("../middlewares/globalCatch");

module.exports = function (app) {
    app.use(cors);
    app.use(express.json());
    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/account", balanceRouter);
    app.use(invalidRoute);
    app.use(globalCatch);
}