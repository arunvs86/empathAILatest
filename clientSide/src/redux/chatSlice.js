import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState: {
        onlineUsers: [],
        messages: [],
        unreadMessagesFromUsers: {}, // To track unread messages per user
        newMessages: false, // Global flag to indicate if there are any unread messages
      },
    reducers:{
        // actions
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        }
    }
});
export const {setOnlineUsers, setMessages} = chatSlice.actions;
export default chatSlice.reducer;