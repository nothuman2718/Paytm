const config = require("config");
const mongoose = require("mongoose");

module.exports=function(){
    mongoose
        .connect(config.get("database")+"/AppPaytm", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to Database"))
        .catch((err) => console.log(err));
}