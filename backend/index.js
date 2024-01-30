const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes/index");
const invalidRoute = require("./middlewares/invalidRoute");
const globalCatch = require("./middlewares/globalCatch");
const mongoose = require("mongoose");
const config = require("config");

mongoose.connect(config.get("database"))
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(err.message));

app.use(cors);
app.use(express.json());

app.use("/api/v1", mainRouter);
app.use(invalidRoute);
app.use(globalCatch);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Connnecte to ${PORT}`);
})

