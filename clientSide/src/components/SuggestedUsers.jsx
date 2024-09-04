import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const  {suggestedCarers}  = useSelector(store => store.carer);
    
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
            </div>
            {
                suggestedCarers.map((carer,index) => {
                    return (
                        <div key={index} className='flex items-center my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${carer?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={carer?.userDp} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${carer?._id}`}>{carer?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{carer?.userName || ''}{ }</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers