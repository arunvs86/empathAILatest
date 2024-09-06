import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import "../components/styles/styles.css";

const Messages = ({ selectedCarer }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { carer } = useSelector((store) => store.carer);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="avatar h-20 w-20">
            <div className = "avatar-fallback">CN</div>
          </div>
          <span>{selectedCarer?.userName}</span>
          <Link to={`/profile/${selectedCarer?._id}`}>
            <button className="button button-secondary button-default-size h-8 my-2">
              View profile
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div
                key={msg._id}
                className={`flex ${
                  msg.senderId === carer?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xl break-words ${
                    msg.senderId === carer?._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
