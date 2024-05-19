const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const otpSchema = new Schema({
    otpCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    // contactno:{
    //     type: Number,
    //     required: true
    // }
    email:{
        type: String,
        required: true
        }
})
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", otpSchema);