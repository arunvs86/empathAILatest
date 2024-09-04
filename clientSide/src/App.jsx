import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import TermsAndConditions from './components/TermsAndConditions'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoutes from './components/ProtectedRoutes'
import useWebSocket from './hooks/useWebSocket'

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/profile/:id',
        element: <ProtectedRoutes> <Profile /></ProtectedRoutes>
      },
      {
        path: '/account/edit',
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/signin',
    element: <Login />
  },
  {
    path: '/termsAndConditions',
    element: <TermsAndConditions />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {
  const { carer } = useSelector(store => store.carer);
  // const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  const socket = useWebSocket('https://empathailatest.onrender.com',carer?._id)
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
