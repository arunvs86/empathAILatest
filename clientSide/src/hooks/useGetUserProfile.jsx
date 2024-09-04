import { setCarerProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


const useGetCarerProfile = (carerId) => {
    const dispatch = useDispatch();
    // const [carerProfile, setCarerProfile] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://empathailatest.onrender.com/api/v1/carer/${carerId}/profile`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setCarerProfile(res.data.carer));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [carerId]);
};
export default useGetCarerProfile;