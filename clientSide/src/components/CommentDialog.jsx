import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Discussion from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setThoughts } from '@/redux/postSlice'
import "../components/styles/styles.css";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedThought, thoughts } = useSelector(store => store.thought);
  const [discussion, setDisucssion] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedThought) {
      setDisucssion(selectedThought.discussions);
    }
  }, [selectedThought]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const sendMessageHandler = async () => {

    try {
      const res = await axios.post(`https://empathailatest.onrender.com/api/v1/thought/${selectedThought?._id}/discuss`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedDiscussionData = [...discussion, res.data.discussion];
        setDisucssion(updatedDiscussionData);

        const updatedPostData = thoughts.map(p =>
          p._id === selectedThought._id ? { ...p, discussions: updatedDiscussionData } : p
        );
        dispatch(setThoughts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isImage = selectedThought?.image
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-1'>
          {isImage && <div className='w-1/2'>
            <img
              src={selectedThought?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
            }
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <div className = "avatar">
                    <div className = "avatar-fallback">CN</div>
                  </div>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{selectedThought?.carer?.userName}</Link>
                  {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                </div>
              </div>

              {/* <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog> */}
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                discussion.map((discussion) => <Discussion key={discussion._id} discussion={discussion} />)
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" value={text} onChange={changeEventHandler} placeholder='Start a discussion...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                <button className='button button-default button-default-size' disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog