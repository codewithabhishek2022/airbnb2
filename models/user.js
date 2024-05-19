const mongoose = require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose =require("passport-local-mongoose");
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    // contactno:{
    //     type:Number,
    //     required:true,
    //     unique:true
    // }
})

//passportLocalMongoose will automatically define username and password to the userSchema. We may or may not write by ourselves 
// the userSchema .

userSchema.plugin(passportLocalMongoose);

module.exports =mongoose.model("User",userSchema)