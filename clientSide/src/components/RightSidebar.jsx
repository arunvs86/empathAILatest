import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
import '../components/styles/rightSideBar.css'


const RightSidebar = () => {
  const { carer } = useSelector(store => store.carer);
  return (
    <div className='w-fit my-10 pr-32'>
      {/* <div className='flex items-center gap-2'>
        <Link to={`/profile/${carer?._id}`}>
          <Avatar>
            <AvatarImage src={carer?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${carer?._id}`}>{carer?.userNname}</Link></h1>
          <span className='text-gray-600 text-sm'>{carer?.userName || 'Bio here...'}</span>
        </div>
      </div> */}
      {/* Useful Links Section */}
      <div className="sidebar-links mt-6">
                <h3 className="text-lg font-semibold mb-2">Some Useful Links</h3>
                <ul>
                    <li className="link-item">
                        <i className="fas fa-heart"></i>
                        <a href="https://www.mind.org.uk" target="_blank" rel="noopener noreferrer">Mind UK</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-hands-helping"></i>
                        <a href="https://www.cruse.org.uk" target="_blank" rel="noopener noreferrer">Cruse Bereavement Care</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-phone"></i>
                        <a href="https://www.samaritans.org" target="_blank" rel="noopener noreferrer">Samaritans</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-headset"></i>
                        <a href="https://www.relate.org.uk" target="_blank" rel="noopener noreferrer">Relate UK</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-user-md"></i>
                        <a href="https://www.mentalhealth.org.uk" target="_blank" rel="noopener noreferrer">Mental Health Foundation</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-bullhorn"></i>
                        <a href="https://www.youngminds.org.uk" target="_blank" rel="noopener noreferrer">Young Minds</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-book"></i>
                        <a href="https://www.griefencounter.org.uk" target="_blank" rel="noopener noreferrer">Grief Encounter</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-child"></i>
                        <a href="https://www.childbereavementuk.org" target="_blank" rel="noopener noreferrer">Child Bereavement UK</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-users"></i>
                        <a href="https://www.sobs.org.uk" target="_blank" rel="noopener noreferrer">Survivors of Bereavement by Suicide (SOBS)</a>
                    </li>
                    <li className="link-item">
                        <i className="fas fa-hands"></i>
                        <a href="https://www.crisistextline.uk" target="_blank" rel="noopener noreferrer">Crisis Text Line UK</a>
                    </li>
                </ul>
            </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar