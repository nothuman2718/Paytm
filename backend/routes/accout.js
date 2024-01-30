const { Router, response } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, signUpSchema, signInSchema, updateSchema } = require("../models/user");
const auth = require("../middlewares/auth");
const validateObjectId = require("../middlewares/validateObjectId");
const { Bank, validateReq } = require("../models/bank");
const { default: mongoose } = require("mongoose");


router.get("/balance", auth, async (req, res) => {
    try {
        const bank = await Bank.findOne({ userId: req.userId });
        console.log(bank);
        return res.status(200).json({ balance: bank.balance })

    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: "Something happened wrong" })
    }
})

router.post("/transfer", auth, async (req, res) => {
    //Todo one cannot send money to themselves
    const session = await mongoose.startSession();
    session.startTransaction();
    const body = req.body;
    const result = validateReq(body);

    if (!result.success) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Invalid props" })
    }
    try {
        const user1 = await Bank.findOne({ userId: req.userId }).session(session);
        if (!(user1.balance >= body.amount)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }
        const user2 = await Bank.findById(body.to).session(session);
        if (!user2) {
            await session.abortTransaction();

            return res.status(400).json({ message: "Invalid account" });
        }

        //performing transfer
        await Bank.updateOne({ userId: req.userId }, { $inc: { balance: -body.amount } }).session(session);
        await Bank.updateOne({ userId: body.to }, { $inc: { balance: body.amount } }).session(session);

        await session.commitTransaction();

        res.json({ message: "Transaction completed successfully" })

    } catch (err) {
        console.log(err);
        session.abortTransaction();
        return res.status(400).json({ message: "Something happend " })
    }

})

module.exports = router;