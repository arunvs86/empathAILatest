import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        userName: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {carer} = useSelector(store=>store.carer);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('https://empathailatest.onrender.com/api/v1/carer/signup', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/signin");
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
                    <p className='text-sm text-center'>Safe Spaces, Open Hearts.</p>
                    <p className='text-sm text-center'>Connect, Heal, and Grow Together.</p>
                </div>
                <div>
                    <span className='font-medium'>Username</span>
                    <br/>
                    <span className='text-small text-sm' >Feel free to use any name, real or anonymous—whatever makes you comfortable.</span>
                        <Input
                        type="text"
                        name="userName"
                        value={input.userName}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>

                <div className="mt-4">
                    <label>
                        <input type="checkbox" required /> I have read the   
                        <Link to="/termsAndConditions" target="_blank" // This opens the link in a new tab
                            rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">Usage Guide and agree to theTerms and Conditions</Link>
                    </label>
                </div>

                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Signup</Button>
                    )
                }
                <span className='text-center'>Already have an account? <Link to="/signin" className='text-blue-600'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup