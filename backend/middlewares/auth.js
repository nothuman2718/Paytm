const config = require("config");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    //check whether token is prefixed with beareer and then split
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(403).json({ message: "Please provide a token" });

        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "Access denied" })
    }
}

module.exports = auth;