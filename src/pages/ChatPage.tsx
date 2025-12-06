import FriendList from "@/components/FriendList"
import ChatBody from "@/components/ChatBody"
import AsideBar from "@/components/AsideBar"
import { useState } from "react"
const ChatPage = () => {
  const [openPage, setOpenPage]=useState<string>("ChatBody");
  
  return (
    <div className="flex w-full h-full" data-theme="dark" >

      <AsideBar/>
      <div className="flex sm:hidden w-9/10">
        {openPage? "ChatBody"===openPage 
        ? <ChatBody onlyMode={true} setOpenPage={setOpenPage}/> 
        : <FriendList onlyMode={true} setOpenPage={setOpenPage}/>: null}
      </div>
      {/* present only FriendList and Chatbody when the screen is large*/}
      <div className="flex max-sm:hidden w-9/10">
        <FriendList onlyMode={false} setOpenPage={null}/>
        <ChatBody onlyMode={false} setOpenPage={null}/>
      </div>
    </div>
  )
}

export default ChatPage