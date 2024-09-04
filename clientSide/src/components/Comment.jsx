import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Discussion = ({ discussion }) => {
    return (
        <div className='my-2'>
            <div className='flex gap-3 items-center'>
                <Avatar>
                    <AvatarImage src={discussion?.carer?.userDp} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{discussion?.carer.userName} <span className='font-normal pl-1'>{discussion?.text}</span></h1>
            </div>
        </div>
    )
}

export default Discussion