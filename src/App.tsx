import {Toaster} from "react-hot-toast"
import {Routes, Route} from "react-router-dom"
import { motion } from "framer-motion"
import ChatPage from "./pages/ChatPage"
import ProfilePage from "./pages/ProfilePage"
import Contacts from "./pages/Contacts"
import LoginPage from "./pages/Login" 
import SignUpPage from "./pages/SignUpPage"
import PostPage from "./pages/PostPage"
import { useAppDispatch, useAppSelector } from "./redux/reduxHook"
import { selectUserInfo } from "./redux/slice/userSlice"
import { use, useEffect } from "react"
import socket from "./lib/socket"
import { SocketNotification, useGetSocketData, useListenSocket} from "./hook/reacthook"
import { addOnlineUser, removeOnlineUser, selectOnlineUserList } from "./redux/slice/onlineUserSlice"
import type { FriendChatBlock, GroupChatBlock, FriendRequest, GroupRequest } from "./lib/const"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  const dispatch = useAppDispatch();
  const currentUser= useAppSelector(selectUserInfo).info;
    
  //SOCKET: USER ONLINE 
  useListenSocket(
    socket,
    currentUser,
    "userOnline",
    (data: number)=>{
       if(data!==undefined && data){
        dispatch(addOnlineUser(data));
      }else{
        console.log("unkown error")
      }
    }
  )
  //USER OFFLINE
  useListenSocket(
    socket,
    currentUser,
    "userOffline",
    (data: number)=>{
      if(data!==undefined && data){
        dispatch(removeOnlineUser(data));
      }else{
        console.log("unkown error")
      }
    }
  )
  //SOCKET CONNECTION EFFECT
  useEffect(() => {
  if (currentUser?.id>0) {
    dispatch({ type: "SOCKET_CONNECT", payload: currentUser.id.toString() });
  }
  return () => {  
    console.log("disconnect socket in app.tsx");
    
  };

  }, [currentUser.id]); 
  

  return (
    <motion.main initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="flex gap-1 h-screen w-screen" > 
      <Toaster position="top-center" />
      <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<ChatPage/>} />      
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/contacts" element={<Contacts/>} /> 
        <Route path="/login" element={<LoginPage/>} /> {/* Use LoginPage component */}
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/post" element={<PostPage/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>

      </Routes>
      </div>
      
    </motion.main>
  )
}

export default App
