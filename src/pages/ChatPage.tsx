import ChatList from "@/components/ChatList"
import ChatBody from "@/components/ChatBody"
import AsideBar from "@/components/AsideBar"
import { useEffect, useState } from "react"
import type { UserDefaultInfo } from "@/lib/const"
import InitialChatBody from "@/components/InitialChatBody"
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook"
import { selectUserInfo } from "@/redux/slice/userSlice"
import type { GroupDefaultInfo } from "@/lib/const"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"


const ChatPage = () => {
  
  const [openPage, setOpenPage]=useState<string>("FriendList");
  const [currentChat, setCurrentChat]= useState<UserDefaultInfo | GroupDefaultInfo>();
  const currentUser= useAppSelector(selectUserInfo).info;
  const navigate= useNavigate();
  const dispatch= useAppDispatch();
  useEffect(()=>{
    if(currentUser.id<=0){
    navigate("/login");
  }
  },[])
  
  
  if(currentUser.id===-1) return <div>Loading...</div>
  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="flex w-full h-full"  >
      
      <AsideBar/>
      <div className="flex sm:hidden w-full">
        {openPage === "ChatBody" && currentChat && currentChat.id !== 0 
        ? <ChatBody onlyMode={true} setOpenPage={setOpenPage} currentChat={currentChat}/> 
        : openPage === "FriendList" 
        ? <ChatList onlyMode={true} setOpenPage={setOpenPage} setCurrentChat={setCurrentChat}/>
        : <InitialChatBody/>
        }
      </div>
      {/* present only FriendList and Chatbody when the screen is large*/}
      <div className="flex max-sm:hidden w-full">
        <ChatList onlyMode={false} setOpenPage={null} setCurrentChat={setCurrentChat}/>
        {currentChat && currentChat.id!==0 
        ? <ChatBody onlyMode={false} setOpenPage={null}  currentChat={currentChat}/>
        : <InitialChatBody/>
        }
      </div>
    </motion.div>
  )
}

export default ChatPage