import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setCarerAuthentication } from '@/redux/authSlice';
import "../components/styles/styles.css";

const EditProfile = () => {
    const imageRef = useRef();
    const { carer } = useSelector(store => store.carer);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: carer?.profilePicture,
        bio: carer?.bio,
        gender: carer?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }


    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePhoto){
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('https://empathailatest.onrender.com/api/v1/carer/profile/edit', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            });
            if(res.data.success){
                const updatedUserData = {
                    ...carer,
                    userAbout:res.data.carer?.userAbout,
                    userDp:res.data.carer?.userDp,
                };
                dispatch(setCarerAuthentication(updatedUserData));
                navigate(`/profile/${carer?._id}`);
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messasge);
        } finally{
            setLoading(false);
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <div className = "avatar">
                            <div className = "avatar-fallback">  {carer?.userName?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h1 className='font-bold text-sm'>{carer?.username}</h1>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
                    <button onClick={() => imageRef?.current.click()} className='button button-default button-default-size bg-[#0095F6] h-8 hover:bg-[#318bc7]'>Change photo</button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                            <button className='button button-default button-default-size w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </button>
                        ) : (
                            <button onClick={editProfileHandler} className='button button-default button-default-size w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>Submit</button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile