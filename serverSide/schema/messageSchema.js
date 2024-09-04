import mongoose, { mongo } from 'mongoose'

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Carer'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Carer'
    },
    message:{
        type:String,
        required:true
    }
},{timestamps: true});

export const Message = mongoose.model('Message',messageSchema)