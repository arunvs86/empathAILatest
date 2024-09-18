import { setBot, setSuggestedCarers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('https://empathailatest.onrender.com/api/v1/carer/find', { withCredentials: true });
                if (res.data.success) {
                    res.data.carers.map(carer => 
                    {
                        if(carer._id == '66d62bdae8774aa19586b681')
                        {
                            dispatch(setBot(res.data.carers));
                        }
                    }
                    )
                    dispatch(setSuggestedCarers(res.data.carers));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
};
export default useGetSuggestedUsers;