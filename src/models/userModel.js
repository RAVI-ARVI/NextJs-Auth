import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter username"],
        unique:true
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique:true
    },
    password: {
        type: String,
        required: [true, "Please enter Password"],
        
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})


const User = mongoose.model.users || mongoose.model('users', userSchema)

export default User