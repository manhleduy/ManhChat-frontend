import {Toaster} from "react-hot-toast"
import {Routes, Route} from "react-router-dom"
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
import { useGetSocketData} from "./hook/reacthook"
import { addOnlineUser, removeOnlineUser, selectOnlineUserList } from "./redux/slice/onlineUserSlice"
import type { FriendChatBlock, GroupChatBlock, FriendRequest, GroupRequest } from "./lib/const"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  const dispatch = useAppDispatch();
  const currentUser= useAppSelector(selectUserInfo).info;
  
  //get group request
  const groupRequest= useGetSocketData<GroupRequest>(socket, currentUser, "receiveGroupRequest");
  useEffect(()=>{
    if(groupRequest){
      console.log("new group request received in app.tsx:", groupRequest);
      //dispatch()
    }
  })
  
  
  //user online 
  const onlineUsers= useGetSocketData<number>(socket, currentUser, "userOnline")
  useEffect(()=>{
    if(onlineUsers!==undefined && onlineUsers){
      
      dispatch(addOnlineUser(onlineUsers));
    }
  }, [onlineUsers])

  //user offline
  const offlineUsers= useGetSocketData<number>(socket, currentUser, "userOffline")
  useEffect(()=>{
    if(offlineUsers!==undefined && offlineUsers){
      dispatch(removeOnlineUser(offlineUsers));
    }
  }, [offlineUsers])
    
  //socket connection effect
  useEffect(() => {
  if (currentUser?.id>0) {
    dispatch({ type: "SOCKET_CONNECT", payload: currentUser.id.toString() });
  }
  return () => {  
    console.log("disconnect socket in app.tsx");
    
  };

  }, [currentUser.id]); 
  

  return (
    <main className="flex gap-1 h-screen w-screen" > 
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
      
    </main>
  )
}

export default App
