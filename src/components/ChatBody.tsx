import React, { useEffect, useState } from 'react';
import ChatBlock from './ChatBlock';
import { ChevronLeft, InfoIcon, XIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { markAsRead, createChat,createGroupChat } from '@/lib/services/chatService';
import { selectUserInfo } from '@/redux/slice/userSlice';
import type { GroupChatBlock, FriendChatBlock,ChatBlockInfo, GroupDefaultInfo, MessageType, } from '@/lib/const';
import toast from 'react-hot-toast';
import socket from '@/lib/socket';
import { useFetch, useGetSocketData } from '@/hook/reacthook';
import GroupInfomation from './GroupInfomation';
import FriendInformation from './FriendInformation';
import { clearAllListeners } from '@reduxjs/toolkit';
import BaseChatBody from './BaseChatBody';
interface Response{
  message:string,
  status: number
}

//GROUP CHAT BODY
const GroupChatBody=(WrapppedComponent: any)=>{
  
  return function EnhancedComponent(props:any){
    const {currentUser, setLoading, setError, currentChat}= props;
    const dispatch= useAppDispatch()
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [response, setResponse]= useState<Response>({message:"", status:0});
    const [inputValue, setInputValue] = useState<string>('');
    const [openInfoPage, setOpenInfoPage]= useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    //handle the type of file selected between the image and the regular file 
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size must be less than 10MB');
        return;
      }
      setAttachedFile(file);
      setInputValue(''); // Clear text input
    }
  };

  //design the Inforbutton to open the infor page
  const InfoButton=()=>{
    return(
    <button className='lg:hidden' onClick={()=>{setOpenInfoPage(true)}}>
      <InfoIcon  width={20} height={20}/>
    </button>
    )
  }
  //handle the submit with different type of Chatblock
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue && !attachedFile) {
      toast.error("Please enter a message or attach a file");
      return;
    }
    if (inputValue && inputValue.length > 250) {
      toast.error("Message is too long");
      return;
    }
    try {
      let fileUrl = null;
      if (attachedFile) {
        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(attachedFile);
        await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
        const base64 = reader.result;
        fileUrl = base64
      }
      const newMessage: GroupChatBlock = {
        content: inputValue || attachedFile?.name || '',
        senderId: currentUser.id,
        groupId: currentChat.id,
        file: fileUrl
      };
      await createGroupChat(newMessage, setResponse, setLoading);
      setMessages(messages => [...messages, newMessage]);
      setInputValue('');
      setAttachedFile(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  //handle the fetching the messages in chat 
  const {data, error, loading}= useFetch<MessageType[]>(`/api/chat/${currentChat.id}`, "post", messages, {memberId: currentUser.id})
  useEffect(() => {
    setMessages(data)
  }, [currentUser.id, currentChat.groupId, data])
    //socket handle
    const groupMessage= useGetSocketData<GroupChatBlock>(socket, currentUser, "receiveGroupMessage");
    useEffect(()=>{
        if(groupMessage && groupMessage.groupId===currentChat.id){
        setMessages(messages=>[...messages, groupMessage])
        /////////dispatch(popGroupChat(currentChat.id)); 

      }else{
        console.log("unkown error")
      }
    }, [groupMessage])
    
    return(
      <>
      <WrapppedComponent
      {...props}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleSubmit={handleSubmit}
      messages={messages}
      response={response}
      openInfoPage={openInfoPage}
      setOpenInfoPage={setOpenInfoPage}
      InfoButton={InfoButton}
      attachedFile={attachedFile}
      setAttachedFile={setAttachedFile}
      handleFileSelect={handleFileSelect}
      />
      <div className=' w-1/3 max-lg:hidden h-full'><GroupInfomation group={currentChat} setOpenInfoPage={setOpenInfoPage} openInfoPage={openInfoPage}/></div>
      {openInfoPage
      &&<div className='w-full lg:hidden h-full'><GroupInfomation group={currentChat} setOpenInfoPage={setOpenInfoPage} openInfoPage={openInfoPage}/></div>
      }
      </>
      )
  }
}
//FRIEND CHAT BODY
const FriendChatBody=(WrappedComponent: any)=>{
  return function EnhancedComponent(props:any){
    const {currentUser, setLoading, setError, currentChat}= props;
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [response, setResponse]= useState<Response>({message:"", status:0});
    const [inputValue, setInputValue] = useState<string>('');
    const [openInfoPage, setOpenInfoPage]= useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size must be less than 10MB');
        return;
      }
      setAttachedFile(file);
      setInputValue(''); // Clear text input
    }
  };
  
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue && !attachedFile) {
      toast.error("Please enter a message or attach a file");
      return;
    }
    if (inputValue && inputValue.length > 250) {
      toast.error("Message is too long");
      return;
    }
    try {
      let fileUrl = null;
      if (attachedFile) {
          if(!attachedFile.name.match(/\.(jpeg|jpg|png)$/i)){
          // Convert file to base64
          const reader = new FileReader();
          reader.readAsDataURL(attachedFile);
          await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
          });
          const base64 = reader.result;
          fileUrl = base64
        }else{

        }
    }

      const newMessage: FriendChatBlock = {
        content: inputValue || attachedFile?.name || '',
        senderId: currentUser.id,
        receiverId: currentChat.id,
        file: fileUrl ||""
      };
      console.log(newMessage)
      await createChat(newMessage, setResponse, setLoading);
      setMessages(messages => [...messages, newMessage]);
      setInputValue('');
      setAttachedFile(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  //handle the fetching the messages in chat 
  const {data, error, loading}= useFetch<MessageType[]>(`/api/chat/${currentUser.id}`, "post", messages, {receiverId: currentChat.id})

  useEffect(() => {
    setMessages(data||[]);
  }, [currentChat.id, currentUser.id, currentChat.id, data])
  //handle socket send message
  const message= useGetSocketData<FriendChatBlock>(socket, currentUser, "receiveMessage");
  useEffect(()=>{
    if(message && message.senderId===currentChat.id){
      setMessages(messages=>[...messages, message]);
      
      ///////dispatch(popFriendChat(currentChat.id));
      
    }else{
      console.log("unkown error")
    }
    return (()=>{
      ///////dispatch(popFriendChat(currentChat.id));
      
    })
  }, [message])

  // change the isread state of the chat block
  useEffect(()=>{
    const markRead=async()=>{
      try{
      
       await markAsRead({receiverId:currentUser.id, senderId:currentChat.id},setError,setLoading)
      }
      catch(e){
        toast.error("error");
      }
    }
    markRead()

  },[])
  const InfoButton=()=>{
    return(
    <button  onClick={()=>{setOpenInfoPage(true)}}>
      <InfoIcon  width={20} height={20}/>
    </button>
    ) 
  }
  return (
    <>
      <WrappedComponent
      {...props}
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleSubmit={handleSubmit}
      messages={messages}
      response={response}
      setOpenInfoPage={setOpenInfoPage}
      InfoButton={InfoButton}
      attachedFile={attachedFile}
      setAttachedFile={setAttachedFile}
      handleFileSelect={handleFileSelect}
      />
      {
      openInfoPage&& 
      <FriendInformation userInfo={currentChat} setOpenInfoPage={setOpenInfoPage}/> 
      }
    </>
  )
  }
    

}
//CHAT BODY
const ChatBody = (
  
  { onlyMode, setOpenPage, currentChat }: 
  { onlyMode: boolean; setOpenPage: any; currentChat: any }) => {

  const currentUser = useAppSelector(selectUserInfo).info;
  const [error, setError]=useState<string>("")
  
  const [loading, setLoading] = useState(false);
  
  
  const checkFriendChat:boolean= currentChat.email? true : false;
  const checkGroupChat: boolean= currentChat.groupName ? true : false;
  
  if(checkFriendChat){
    const EnhanceChatBody= FriendChatBody(BaseChatBody)
    return <EnhanceChatBody
    onlyMode={onlyMode}
    setOpenPage={setOpenPage}
    currentChat={currentChat}
    currentUser={currentUser}
    setError={setError}
    setLoading={setLoading}
    />
    
  }else if(checkGroupChat){
    const EnhanceChatBody= GroupChatBody(BaseChatBody)
    return <EnhanceChatBody 
    onlyMode={onlyMode}
    setOpenPage={setOpenPage}
    currentChat={currentChat}
    currentUser={currentUser}
    setError={setError}
    setLoading={setLoading}
    />
  }
  return (
    <h1 className='text-red-500'>Server Error</h1>
  );
};

export default ChatBody;
