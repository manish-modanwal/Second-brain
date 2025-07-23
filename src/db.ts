import mongoose, { Schema, model } from "mongoose";

// ✅ Good practice: connect from a separate file in production apps
mongoose.connect("mongodb+srv://admin-1:MKM12345@cluster0.dggvsi7.mongodb.net/second-brain");

// ✅ Define User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
});


const ContentSchema= new Schema({

    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId: {type : mongoose.Types.ObjectId, ref:'users', required:true },
    type: String,

})


const LinkSchema= new Schema({

    hash :String,
    userId: {type : mongoose.Types.ObjectId, ref:'users', required:true ,unique:true},

})

export const LinkModel = model("Links", LinkSchema);

// ✅ Export User model
export const UserModel = model("users", UserSchema);
export const ContentModel= model("Content", ContentSchema)
