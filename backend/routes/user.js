const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, signUpSchema, signInSchema, updateSchema } = require("../models/user");
const auth = require("../middlewares/auth");
const { Bank, validateReq } = require("../models/bank");


router.post("/signup", async (req, res) => {
    //Use lodash and pick only req props
    const body = req.body;
    const result = signUpSchema(body);
    if (!result.success) return res.status(411).json({ message: result.error })
    try {
        let user = await User.findOne({ username: req.body.username });
        if (user) return res.status(411).json({ message: "User already exists" })

        user = new User(req.body);
        //Add Hashing before saving to database
        user = await user.save();

        const bank = await Bank.create({
            userId: user._id,
            balance: 1 + Math.random() * 100000
        })

        const token = jwt.sign({ userId: user._id }, config.get("jwtPrivateKey"));
        res.status(200).json({ token: token, message: "User Crreated successfully" });

    } catch (err) {
        console.log(err);
        res.status(411).json({ message: err.message });

    }
})

router.post("/signin", async (req, res) => {
    //Use lodash and pick only req props
    const body = req.body;
    const result = signInSchema(body);
    if (!result.success) return res.status(411).json({ message: result.error });

    try {
        let user = await User.findOne({ username: body.username });
        if (!user) return res.status(411).json({ message: "Error while logging in" })

        const token = jwt.sign({ userId: user._id }, config.get("jwtPrivateKey"));
        res.status(200).json({ token, message: "Logged in Successfully" });

    } catch (err) {
        return res.status(411).json({ message: "Error while logging in" })
    }

})

router.put("/update", auth, async (req, res) => {

    const body = req.body;
    //Handle username change in next version
    if ("username" in req.body) {
        return res.status(411).json({ message: "You cannot chnage username for this version" })
    }
    const result = updateSchema(body);
    if (!result.success) return res.status(411).json({ message: result.error })

    try {
        const updateObject = {
            ...req.body
        }
        let user = await User.findByIdAndUpdate(req.userId, updateObject, { new: true });

        return res.status(200).json({ message: "Updated Successfully" });
    } catch (err) {
        return res.status(404).json({ message: "Error in Catch while updating" })
    }
})


router.get("/bulk", async (req, res, next) => {
    const filter = req.query.filter || "";
    try {
        const user = await User.find({
            $or: [
                { firstName: { $regex: new RegExp(filter, 'i') } },
                { lastName: { $regex: new RegExp(filter, 'i') } },
            ]
        }).select("firstName lastName _id");
        //Dont send the one who is querying
        res.status(200).json({ user })

    }
    catch (err) {
        res.status(404).json({ message: "Something happend while queryin other users" })
    }
})

module.exports = router;

