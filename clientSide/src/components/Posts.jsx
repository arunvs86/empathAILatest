import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {thoughts} = useSelector(store=>store.thought);
  return (
    <div>
        {
            thoughts.map((thought) => <Post className = "space-y-8" key={thought._id} thought={thought}/>)
        }
    </div>
  )
}

export default Posts