import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart, FaCheck, FaTimesCircle } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setThoughts, setSelectedThought } from "@/redux/postSlice";
import "../components/styles/styles.css"

const Post = ({ thought }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { carer } = useSelector((store) => store.carer);
  const { thoughts } = useSelector((store) => store.thought);
  const [liked, setLiked] = useState(
    thought?.appreciations?.includes(carer?._id) || false
  );
  const [postLike, setPostLike] = useState(thought?.appreciations?.length);
  const [discussion, setDiscussion] = useState(thought.discussions);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "unAppreciate" : "appreciate";
      const res = await axios.get(
        `https://empathailatest.onrender.com/api/v1/thought/${thought._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = thoughts.map((p) =>
          p._id === thought._id
            ? {
                ...p,
                appreciations: liked
                  ? p.appreciations.filter((id) => id !== carer._id)
                  : [...p.appreciations, carer._id],
              }
            : p
        );
        dispatch(setThoughts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://empathailatest.onrender.com/api/v1/thought/${thought._id}/discuss`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedDiscussionData = [...discussion, res.data.discussion];
        setDiscussion(updatedDiscussionData);

        const updatedPostData = thought.map((p) =>
          p._id === thought._id
            ? { ...p, discussions: updatedDiscussionData }
            : p
        );

        dispatch(setThoughts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://empathailatest.onrender.com/api/v1/thought/delete/${thought?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = thought.filter(
          (postItem) => postItem?._id !== thought?._id
        );
        dispatch(setThoughts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://empathailatest.onrender.com/api/v1/thought/${thought?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reportHandler = async () => {
    try {
      const res = await axios.post(
        `https://empathailatest.onrender.com/api/v1/thought/${thought._id}/report`,
        { carerId: carer._id },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Thought reported successfully!");
        dispatch(
          setThoughts(
            thoughts.map((p) =>
              p._id === thought._id
                ? {
                    ...p,
                    thought: res.data.thought.thought,
                    flagged: res.data.thought.flagged,
                  }
                : p
            )
          )
        );
      }
    } catch (error) {
      toast.error("You have already reported this post");
      console.log(error);
    }
  };

  return (
    <div
      className="flex-1 my-8 mx-2 flex flex-col items-center w-full"
      style={{ marginLeft: "6rem", marginRight: "2rem", width: "100%" }}
    >
      <div
        className="my-8 mx-auto"
        style={{ maxWidth: "750px", width: "100%" }}
      >
        <div className="flex items-center gap-2">
          <div className = "avatar">
            <div className = "avatar-fallback">  {thought.carer?.userName?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-bold">{thought.carer?.userName}</h1>
            {carer?._id === thought?.carer?._id && (
              <span className="badge badge-secondary">Owner</span>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {carer && carer?._id === thought?.carer?._id && (
              <button
                onClick={deletePostHandler}
                className=" button button-ghost button-default-size cursor-pointer w-fit"
              >
                Delete
              </button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {thought.flagged ? (
        <span>This post has been reported and is under review.</span>
      ) : (
        <span
          style={{ alignSelf: "start", marginLeft: 35, marginBottom: 20 }}
          className="cursor-pointer text-xl text-black-400"
        >
          {thought.thought}
        </span>
      )}

      {thought.image && (
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src={thought.image}
        />
      )}

      <div className="flex justify-between my-2 justify-start">
        <div className="flex" style={{ gap: 200 }}>
          {liked ? (
            <FaCheck
              onClick={likeOrDislikeHandler}
              size={"24"}
              className="cursor-pointer text-black-600"
            />
          ) : (
            <FaCheck
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedThought(thought));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          {/* <Send className="cursor-pointer hover:text-gray-600" /> */}
          {carer?._id !== thought?.carer?._id && (
            <FaTimesCircle
              variant="ghost"
              onClick={reportHandler}
              className="cursor-pointer w-fit"
            >
              Report
            </FaTimesCircle>
          )}

          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <span
        className="font-medium block mb-2"
        style={{ alignSelf: "start", marginLeft: 35 }}
      >
        {postLike} appreciations
      </span>
      <p>
        <span className="font-medium mr-2">{thought.carer?.username}</span>
        {thought.caption}
      </p>
      {discussion?.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedThought(thought));
            setOpen(true);
          }}
          style={{ alignSelf: "start", marginLeft: 35 }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {discussion?.length} discussions
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div
        className="flex items-center"
        style={{ alignSelf: "start", marginTop: 20, marginLeft: 35 }}
      >
        <input
          type="text"
          placeholder="Add a discussion..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
