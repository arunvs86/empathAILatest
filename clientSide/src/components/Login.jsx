import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCarerAuthentication } from '@/redux/authSlice';
import "../components/styles/styles.css";

const Login = () => {
    const [input, setInput] = useState({
        userName: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {carer} = useSelector(store=>store.carer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('https://empathailatest.onrender.com/api/v1/carer/signin', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                console.log(res.data)
                dispatch(setCarerAuthentication(res.data.carer));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    userName: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(carer){
            navigate("/");
        }
    },[])
    
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>EmpathAI</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <input
                        type="text"
                        name="userName"
                        value={input.userName}
                        onChange={changeEventHandler}
                        className="input focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <input 
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="input focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <button className='button button-default button-default-size'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </button>
                    ) : (
                        <button className='button button-default button-default-size' type='submit'>Login</button>
                    )
                }

                <span className='text-center'>Dosent have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
            </form>
        </div>
    )
}

export default Login