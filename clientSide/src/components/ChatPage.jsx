import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCarer } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import "../components/styles/styles.css"

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { carer, suggestedCarers, selectedCarer } = useSelector(
    (store) => store.carer
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
        let newMessage = null;

        // First send the user's message to the server
        const res = await axios.post(
            `https://empathailatest.onrender.com/api/v1/message/send/${receiverId}`,
            { textMessage },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:5173",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
                withCredentials: true,
            }
        );

        if (res.data.success) {
            newMessage = res.data.newMessage;

            // If the receiver is the bot, fetch the bot's response
            if (receiverId === "66d62bdae8774aa19586b681") {
                const userQuery = {
                    question: newMessage.message,
                    session_id: carer._id,
                };

                const botResponse = await axios.post(
                    `https://empathaiimage-1065309265714.europe-west2.run.app/api/ask`,
                    userQuery,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (botResponse.status === 200) {
                    const newMessageFromBot = {
                        senderId: "66d62bdae8774aa19586b681", // Explicitly set the bot's senderId
                        receiverId: carer._id,
                        textMessage: botResponse.data.answer,
                    };

                    // Send the bot's response to the server to save it
                    const botRes = await axios.post(
                        `https://empathailatest.onrender.com/api/v1/message/send/${carer._id}`,
                        newMessageFromBot, // Send the bot's message object with senderId
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": "http://localhost:5173",
                                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                            },
                            withCredentials: true,
                        }
                    );

                    if (botRes.data.success) {
                        // Dispatch the bot response as a new message after saving it
                        dispatch(setMessages([...messages, newMessage, botRes.data.newMessage]));
                    }
                }
            } else {
                // Dispatch the user's new message
                dispatch(setMessages([...messages, newMessage]));
            }

            // Clear the input after sending the message
            setTextMessage("");
        }
    } catch (error) {
        console.log(error);
    }
};



  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of Enter key
      sendMessageHandler(selectedCarer?._id);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedCarer(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{carer?.userName}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {
            // suggestedCarers.push(EmpathAI)
            suggestedCarers
              .slice() // Create a shallow copy of the array to avoid mutating the original array
              .sort((a, b) => {
                if (a._id === "66d62bdae8774aa19586b681") return -1;
                if (b._id === "66d62bdae8774aa19586b681") return 1;
                return 0;
              })
              .map((suggestedCarer) => {
                let isOnline = onlineUsers.includes(suggestedCarer?._id);
                if (suggestedCarer?._id == "66d62bdae8774aa19586b681")
                  isOnline = true;

                return (
                  <div
                    key={suggestedCarer._id}
                    onClick={() => dispatch(setSelectedCarer(suggestedCarer))}
                    className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="avatar w-14 h-14">
                      {/* <div className="avatar img" src={suggestedCarer?.userDp} /> */}
                      <div className="avatar-fallback">  {suggestedCarer?.userName?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {suggestedCarer?.userName}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isOnline ? "text-green-600" : "text-red-600"
                        } `}
                      >
                        {isOnline ? "online" : "offline"}
                      </span>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </section>
      {selectedCarer ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <div className="avatar">
              <div className="avatar-fallback">  {selectedCarer?.userName?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex flex-col">
              <span>{selectedCarer?.userName}</span>
            </div>
          </div>
          <Messages selectedCarer={selectedCarer} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={handleKeyDown} // Add the key down handler
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <button className="button button-default button-default-size" onClick={() => sendMessageHandler(selectedCarer?._id)}>
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          {
            // <MessageCircleCode className='w-32 h-32 my-4' />
            //             <h1 className='font-medium'>Your messages</h1>
            //             <span>Send a message to start a chat.</span>
            <span>Select a chat to start or continue the conversation.</span>
          }
        </div>
      )}
    </div>
  );
};

export default ChatPage;
