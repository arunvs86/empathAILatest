import mongoose, { mongo } from "mongoose";

const thoughtSchema = new mongoose.Schema({
    thought: {type:String, required:true},
    image: {type: String, default:''},
    carer: {type:mongoose.Schema.Types.ObjectId, ref:'Carer', required: true},
    appreciations: [{type:mongoose.Schema.Types.ObjectId, ref:'Carer'}],
    discussions: [{type:mongoose.Schema.Types.ObjectId, ref:'Discussion'}]
},{timestamps: true});

export const Thought = mongoose.model('Thought', thoughtSchema)
