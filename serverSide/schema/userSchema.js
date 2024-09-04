import mongoose, { mongo } from "mongoose";

 const CarerProfileSchema = new mongoose.Schema({
    userName: {type:String , required:true,unique:true},
    password: {type:String,required:true},
    userDp: {type:String, default:''},
    userAbout: {type:String, default:''},
    careGivers: [{type:mongoose.Schema.Types.ObjectId, ref:'Carer'}],
    caringFor: [{type:mongoose.Schema.Types.ObjectId, ref:'Carer'}],
    thoughts: [{type:mongoose.Schema.Types.ObjectId, ref:'Thought'}],
    bookmarks: [{type:mongoose.Schema.Types.ObjectId, ref:'Thought'}],
 },{timestamps: true});

 export const Carer = mongoose.model('Carer',CarerProfileSchema);