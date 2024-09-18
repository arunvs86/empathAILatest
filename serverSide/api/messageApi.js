import {Chat} from "../schema/chatSchema.js";
import { getReceiverSocketId, io } from "../socketConfig/socketConnection.js";
import {Message} from "../schema/messageSchema.js"
import { encrypt,decrypt } from '../helpers/encryption.js';  // Import encryption utility

// for chatting

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.body.senderId || req.id; // Use req.body.senderId if provided, otherwise use req.id (user's ID)
        const receiverId = req.params.id;
        const message = req.body.textMessage;
      
        const encryptedMessage = encrypt(message);


        let chat = await Chat.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        // establish the conversation if not started yet.
        if(!chat){
            chat = await Chat.create({
                participants:[senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: encryptedMessage,  // Save encrypted message
        });

        if(newMessage) chat.messages.push(newMessage._id);

        await Promise.all([chat.save(),newMessage.save()])

        // implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        newMessage.message = decrypt(newMessage.message)
        
        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}


export const getAllMessages = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const chat = await Chat.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');

        if(!chat) return res.status(200).json({success:true, messages:[]});

        // Decrypt the messages before sending them to the client
        const decryptedMessages = chat.messages.map((message) => ({
            ...message._doc,
            message: decrypt(message.message) // Decrypt the message
          }));

        return res.status(200).json({success:true, messages:decryptedMessages});
        
    } catch (error) {
        console.log(error);
    }
}