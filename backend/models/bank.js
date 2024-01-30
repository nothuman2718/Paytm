const mongoose = require("mongoose");
const z = require("zod");

const bankSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    balance: { type: Number, required: true }
})

const reqSchema = z.object({
    to: z.string(),
    amount: z.number()
})

function validateReq(body) {
    return reqSchema.safeParse(body);
}

const Bank = mongoose.model("Bank", bankSchema);

module.exports = { Bank, validateReq };