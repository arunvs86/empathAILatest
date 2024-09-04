import { setMessages } from "@/redux/chatSlice";
import { setThoughts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedCarer} = useSelector(store=>store.carer);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`https://empathailatest.onrender.com/api/v1/message/all/${selectedCarer?._id}`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedCarer]);
};

export default useGetAllMessage;