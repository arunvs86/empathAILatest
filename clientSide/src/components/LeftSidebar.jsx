import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCarerAuthentication } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setThoughts, setSelectedThought } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import "../components/styles/styles.css";


const LeftSidebar = () => {
  const navigate = useNavigate();
  const { carer } = useSelector((store) => store.carer);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { thoughts } = useSelector((store) => store.thought);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "https://empathailatest.onrender.com/api/v1/carer/signout",
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setCarerAuthentication(null));
        dispatch(setSelectedThought(null));
        dispatch(setThoughts([]));
        navigate("/signin");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "My Profile") {
          console.log(carer)
          navigate(`/profile/${carer?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
    else if (textType === "EmpathAIBot") {
      navigate("/chat");
    }
  };

  const notificationHandler = (notification) => {
    const foundThought = thoughts.find(
      (thought) => thought._id === notification.thoughtId
    );    
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <div className="avatar w-6 h-6">
          <div className = "avatar-fallback">  {carer?.userName?.charAt(0).toUpperCase()}          </div>
        </div>
      ),
      text: "My Profile",
    },
    { icon: <MessageCircle />, text: "EmpathAIBot" },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">EmpathAI</h1>
        <div>
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="button button-default button-icon rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  key={notification.userId}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <div className = "avatar">
                                    <div className = "avatar-fallback">  {carer?.userName?.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                  <p
                                    onClick={() =>
                                      notificationHandler(notification)
                                    }
                                    className="text-sm"
                                  >
                                    <span className="font-bold">
                                      {notification.userDetails?.userName}
                                    </span>{" "}
                                    appreciated your thought
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
