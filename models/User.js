const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        fullName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        college: {type: String, required: true},
        branch: {type: String, required: true},
        enrollmentNumber: {type: String, required: true, unique: true},
        passingYear: {type: String, required: true},
        company: {type: String, required: true, lowercase: true},
        package: {type: String, required: true},
        password: {type: String, required: true},
        confirmPassword : {type: String},
        linkedIn: {type: String},
        instagram: {type: String},
        twitter: {type: String},
        interview: {type: String, required: true},
        profilePic: {type: String}
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)