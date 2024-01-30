const mongoose = require("mongoose");
const z = require("zod");


const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxLength: 50, trim: true },
    lastName: { type: String, required: true, maxLength: 50, trim: true },
    password: { type: String, required: true, minLength: 6, maxLength: 40, trim: true },
    username: { type: String, required: true, minLength: 6, maxLength: 50, unique: true, trim: true, lowercase: true }
})

const signup = z.object({
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

const signin = z.object({
    username: z.string(),
    password: z.string()
})

const update = z.object({
    password: z.string().min(6).optional(),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional()

})

function signUpSchema(data) {
    return signup.safeParse(data);
}

function signInSchema(data) {
    return signin.safeParse(data);
}

function updateSchema(data) {
    return update.safeParse(data);
}

const User = mongoose.model("User", UserSchema);

module.exports = { User, signUpSchema, signInSchema, updateSchema };