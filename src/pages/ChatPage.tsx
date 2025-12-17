import FriendList from "@/components/FriendList"
import ChatBody from "@/components/ChatBody"
import AsideBar from "@/components/AsideBar"
import { useEffect, useState } from "react"
import type { UserDefaultInfo } from "@/lib/const"
import InitialChatBody from "@/components/InitialChatBody"
import { useAppDispatch, useAppSelector } from "@/redux/reduxHook"
import { Login } from "@/lib/services/userService"
import { selectUserInfo } from "@/redux/userSlice"
const initialChat: UserDefaultInfo={
  id: 0,
  name: "",
  address:"", 
  email:"",
  profilePic:"",
  phonenumber:"",
  birthday:""
}
const defaultuser={
  email:"mle529189@gmail.com",
  password: "lem@19072006"
}
const ChatPage = () => {

  const [openPage, setOpenPage]=useState<string>("FriendList");
  const [currentChat, setCurrentChat]= useState<UserDefaultInfo>(initialChat);
  const currentUser= useAppSelector(selectUserInfo).info;
  const dispatch= useAppDispatch()
  useEffect(()=>{
    dispatch(Login(defaultuser));
  },[])
  if(currentUser.id===-1) return <div>Loading...</div>
  return (
    <div className="flex w-full h-full" data-theme="dark" >
      
      <AsideBar/>
      <div className="flex sm:hidden w-full">
        {openPage === "ChatBody" && currentChat.id !== 0 
        ? <ChatBody onlyMode={true} setOpenPage={setOpenPage} currentChat={currentChat}/> 
        : openPage === "FriendList" 
        ? <FriendList onlyMode={true} setOpenPage={setOpenPage} setCurrentChat={setCurrentChat}/>
        : <InitialChatBody/>
        }
      </div>
      {/* present only FriendList and Chatbody when the screen is large*/}
      <div className="flex max-sm:hidden w-full">
        <FriendList onlyMode={false} setOpenPage={null} setCurrentChat={setCurrentChat}/>
        {currentChat.id===0
        ? <InitialChatBody/>
        : <ChatBody onlyMode={false} setOpenPage={null}  currentChat={currentChat}/>
        }
      </div>
    </div>
  )
}

export default ChatPage