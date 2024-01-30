const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Connected to ${PORT}`);
})

