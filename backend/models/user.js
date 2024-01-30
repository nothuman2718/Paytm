const mongoose = require("mongoose");
const z = require("zod");


const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxLength: 50, trim: true },
    lastName: { type: String, required: true, maxLength: 50, trim: true },
    password: { type: String, required: true, minLength: 6, maxLength: 40, trim: true },
    email: { type: String, required: true, maxLength: 50, trim: true },
    username: { type: String, required: true, minLength: 6, maxLength: 50, unique: true, trim: true, lowercase: true }
})

const schema = z.object({
    username: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

function signUpSchema(body) {
    const result = schema.safeParse(body);

    return result;
}


const User = mongoose.model("User", UserSchema);

module.exports = { User, signUpSchema };