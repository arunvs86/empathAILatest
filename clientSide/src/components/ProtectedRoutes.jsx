import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const {carer} = useSelector(store=>store.carer);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!carer){
            navigate("/signin");
        }
    },[])
  return <>{children}</>
}

export default ProtectedRoutes;