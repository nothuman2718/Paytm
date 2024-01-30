const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, signUpSchema } = require("../models/user")
const invalidRoute = require("../middlewares/invalidRoute")


router.post("/signup", async (req, res) => {
    //Validate props 
    const body = req.body;
    // const result = signUpSchema(body);
    // console.log(result.success);
    // if (!result.success) return res.status(411).json({ message: result.error })
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) return res.status(411).json({ message: "User already exists" })

        user = new User(req.body);
        console.log(user);
        //Add Hashing before saving to database
        user = await user.save();
        const token = jwt.sign({ userId: user._id }, config.get("jwtPrivateKey"));
        res.status(200).json({ token: token, message: "User Crreated successfully" });

    } catch (err) {
        res.status(411).json({
            message: err.message
        })

    }



})

router.post("/signin", (req, res) => {

})

router.put("/update", (req, res) => {

})

router.use(invalidRoute)

module.exports = router;

