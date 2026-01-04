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
import { useEffect } from "react"
import socket from "./lib/socket"
import { useGetMessage, useUserOffline, useUserOnline } from "./hook/reacthook"
import { pushFriendChat,pushGroupChat, selectChatReceivedList} from "./redux/slice/ChatReceivedSlice"
import { addOnlineUser, removeOnlineUser, selectOnlineUserList } from "./redux/slice/onlineUserSlice"

function App() {
  const dispatch = useAppDispatch();
  const currentUser= useAppSelector(selectUserInfo).info;
  //get message
  const {message, groupMessage}=useGetMessage(socket, currentUser)
  useEffect(()=>{
    if(message){
      console.log("new message received in app.tsx:", message);
      dispatch(pushFriendChat(message));
    }
    if(groupMessage){
      console.log("new group message received in app.tsx:", groupMessage);
      dispatch(pushGroupChat(groupMessage));
    }
  }, [message])
  //user online 
  const onlineUsers=useUserOnline(socket, currentUser);
  useEffect(()=>{
    if(onlineUsers!==undefined && onlineUsers){
      
      dispatch(addOnlineUser(onlineUsers));
    }
  }, [onlineUsers])

  
  //user offline
  const offlineUsers= useUserOffline(socket, currentUser);
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
      </Routes>
      </div>
      
    </main>
  )
}

export default App
