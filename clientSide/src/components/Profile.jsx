import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetCarerProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import axios from "axios";
import { setCarerProfile } from "@/redux/authSlice";
import { useEffect } from "react";
import Post from './Post'
import RightSidebar from "./RightSidebar";
import "../components/styles/styles.css";


const Profile = () => {
  const params = useParams();
  const carerId = params.id;
  useGetCarerProfile(carerId);
  const [activeTab, setActiveTab] = useState("posts");

  const { carerProfile, carer } = useSelector((store) => store.carer);
  
  const [targetProfile, setTargetProfile] = useState(carerProfile);

  const isLoggedInUserProfile = carer?._id === carerProfile?._id;
  const [isFollowing, setisFollowing] = useState(
    carerProfile?.careGivers?.includes(carer._id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setCarerProfile(targetProfile));
    };
  }, [targetProfile, isFollowing]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleFollow = async (carer) => {
    const carers = {
      careGiver: carer._id,
      caringFor: carerProfile._id,
    };

    const res = await axios.post(
      `https://empathailatest.onrender.com/api/v1/carer/toggleCare/`,
      carers,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setisFollowing(!isFollowing);
      setTargetProfile(res.data.targetCarer);
    }
  };

  const displayedThought =
    activeTab === "posts" ? carerProfile?.thoughts : carerProfile?.bookmarks;
    console.log("Called")
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <div className="avatar h-32 w-32">
              <div className = "avatar-fallback">CN</div>
            </div>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{carerProfile?.userName}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <button
                        className=" button button-secondary button-default-size hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </button>
                    </Link>
                  </>
                ) : isFollowing ? (
                  <>
                    <button 
                      onClick={() => toggleFollow(carer)}
                      className="button button-secondary button-default-size h-8"
                    >
                      Unfollow
                    </button>
                    {/* <button  className="button button-secondary button-default-size h-8">
                      Message
                    </button> */}
                  </>
                ) : (
                  <button
                    onClick={() => toggleFollow(carer)}
                    className="button button-default button-default-size bg-[#0095F6] hover:bg-[#3192d2] h-8"
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {carerProfile?.thoughts.length}{" "}
                  </span>
                  Thoughts
                </p>
                <p>
                  <span className="font-semibold">
                    {targetProfile?.careGivers.length}{" "}
                  </span>
                  Caregivers
                </p>
                <p>
                  Caring For{" "}
                  <span className="font-semibold">
                    {targetProfile?.caringFor.length}{" "}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {displayedThought?.map((thought) => {
              console.log(thought)
              return (
                // <div
                //   key={thought?._id}
                //   className="relative group cursor-pointer"
                // >
                //   {thought.thought}
                //   {thought.image && (
                //     <img
                //       className="rounded-sm my-2 w-full aspect-square object-cover"
                //       src={thought.image}
                //     />
                //   )}
                //   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                //     <div className="flex items-center text-white space-x-4">
                //       <button className="flex items-center gap-2 hover:text-gray-300">
                //         <Heart />
                //         {/* <span>{thought ? thought?.appreciations.length : ""}</span> */}
                //       </button>
                //       <button className="flex items-center gap-2 hover:text-gray-300">
                //         <MessageCircle />
                //         {/* <span>{thought ? thought?.discussions.length: ""}</span> */}
                //       </button>
                //     </div>
                //   </div>
                // </div>
                
                <Post className = "spakce-y-8" key={thought._id} thought={thought}/>

                
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
