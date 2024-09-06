import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setThoughts } from "@/redux/postSlice";
import "../components/styles/styles.css"

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { carer } = useSelector((store) => store.carer);
  const { thoughts } = useSelector((store) => store.thought);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("thought", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://empathailatest.onrender.com/api/v1/thought/addThought",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setThoughts([res.data.thought, ...thoughts])); // [1] -> [1,2] -> total element = 2
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          <DialogTitle>Create New Thought</DialogTitle>
          <DialogDescription>
            Write your thoughts and share them with your followers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <div className = "avatar">
            <div className = "avatar-fallback"> 
               {carer?.userName?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="font-semibold text-xs">{carer?.username}</h1>
            {/* <span className='text-gray-600 text-xs'>Bio here...</span> */}
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Share your thoughts..."
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <button 
          onClick={() => imageRef.current.click()}
          className="button button-default button-default-size w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Upload Image
        </button>
        {imagePreview && loading ? (
          <button className="button button-default button-default-size">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </button>
        ) : (
          <button onClick={createPostHandler} type="submit" className="button button-default button-default-size w-full">
            Post
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
