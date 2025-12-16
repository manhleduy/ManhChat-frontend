import FriendList from "@/components/FriendList"
import ChatBody from "@/components/ChatBody"
import AsideBar from "@/components/AsideBar"
import { useState } from "react"
import type { UserDefaultInfo } from "@/lib/const"
import InitialChatBody from "@/components/InitialChatBody"
const initialChat: UserDefaultInfo={
  id: 0,
  name: "",
  address:"", 
  email:"",
  profilePic:"",
  phonenumber:"",
  birthday:""
}
const ChatPage = () => {
  const [openPage, setOpenPage]=useState<string>("FriendList");
  const [currentChat, setCurrentChat]= useState<UserDefaultInfo>(initialChat);
  console.log(currentChat);
  
  return (
    <div className="flex w-full h-full" data-theme="dark" >
      
      <AsideBar/>
      <div className="flex sm:hidden w-9/10">
        {openPage === "ChatBody" && currentChat.id !== 0 
        ? <ChatBody onlyMode={true} setOpenPage={setOpenPage} setCurrentChat={setCurrentChat} currentChat={currentChat}/> 
        : openPage === "FriendList" 
        ? <FriendList onlyMode={true} setOpenPage={setOpenPage} setCurrentChat={setCurrentChat}/>
        : <InitialChatBody/>
        }
      </div>
      {/* present only FriendList and Chatbody when the screen is large*/}
      <div className="flex max-sm:hidden w-9/10">
        <FriendList onlyMode={false} setOpenPage={null} setCurrentChat={setCurrentChat}/>
        {currentChat.id===0
        ?<InitialChatBody/>
        :<ChatBody onlyMode={false} setOpenPage={null} setCurrentChat={setCurrentChat} currentChat={currentChat}/>
        }
      </div>
    </div>
  )
}

export default ChatPage