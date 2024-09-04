import mongoose from "mongoose"

const discussionSchema = new mongoose.Schema({
    text: {type:String,required:true},
    carer: {type:mongoose.Schema.Types.ObjectId,ref:'Carer', required:true},
    thought: {type:mongoose.Schema.Types.ObjectId, ref:'Thought', required:true}
},{timestamps: true});

export const Discussion = mongoose.model('Discussion', discussionSchema)
