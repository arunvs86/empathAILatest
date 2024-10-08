import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    participants: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Carer'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
},{timestamps: true});

export const Chat = mongoose.model('Chat', chatSchema)