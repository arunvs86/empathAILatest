import { useEffect, useRef } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setOnlineUsers } from '../redux/chatSlice';
import { setMessages } from "@/redux/chatSlice";
import { setLikeNotification } from '../redux/rtnSlice';
import { io } from "socket.io-client"; // Import this to use the `io` function

const useWebSocket = (url, userId,options = { transports: ['websocket'] }) => {
    const socketRef = useRef(null);
    const dispatch = useDispatch();
    const { messages } = useSelector(store => store.chat);

    useEffect(() => {
        if (userId) {
            socketRef.current = io(url, {
                query: { userId },
                ...options,
            });

            socketRef.current = io(url, {
                query: { userId },
                transports: ['websocket'],
            });
            
            socketRef.current.on('connect', () => {
                console.log('Connected to server:', socketRef.current.id);
            });
            
            socketRef.current.on('connect_error', (err) => {
                console.error('Connection Error:', err.message);
            });
            
            socketRef.current.on('disconnect', (reason) => {
                console.warn('Disconnected from server:', reason);
            });

            socketRef.current.on('getOnlineUsers', (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            });

            socketRef.current.on('notification', (notification) => {
                dispatch(setLikeNotification(notification));
            });

            socketRef.current.on('newMessage', (newMessage) => {
                dispatch(setMessages([...messages, newMessage]));
            })
    
        }

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url, userId, dispatch,messages, setMessages]);

    return socketRef.current;
};

export default useWebSocket;
