import React, { useEffect, useState } from 'react';
import ChatBlock from './ChatBlock';
import { ChevronLeft, InfoIcon, XIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { getAllChat, markAsRead } from '@/lib/services/chatService';
import { selectUserInfo } from '@/redux/slice/userSlice';
import type { GroupChatBlock, FriendChatBlock,ChatBlockInfo, GroupDefaultInfo, MessageType, } from '@/lib/const';
import { createChat, getAllGroupChat, createGroupChat } from '@/lib/services/chatService';
import toast from 'react-hot-toast';
import { popFriendChat, popGroupChat, selectChatReceivedList } from '@/redux/slice/ChatReceivedSlice';
import socket from '@/lib/socket';
import { useGetSocketData } from '@/hook/reacthook';
import GroupInfomation from './GroupInfomation';
import FriendInformation from './FriendInformation';
import { clearAllListeners } from '@reduxjs/toolkit';
interface Response{
  message:string,
  status: number
}

const BaseChatBody=(props:any)=>{
    const {
        inputValue,//private
        setInputValue,//private
        onlyMode,//public
        response, //private
        setOpenPage, //public
        currentChat, //public
        openInfoPage, //private
        handleSubmit,//private
        messages,//private
        loading,//public
        InfoButton,
        attachedFile,
        setAttachedFile,
        handleFileSelect,
        setOpenInfoPage,
      }= props;
    return (
      <div className={`w-full h-full flex flex-col  overflow-hidden max-lg:${openInfoPage? "hidden": ""}`} >
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-200 bg-gray-50">
        <h1 className=" flex text-2xl font-semibold text-gray-900" id="chatTitle">
          {//open this the chat list when the screen size is in only mode
          onlyMode
          ?<div onClick={() => {setOpenPage("FriendList"); }}>
          <ChevronLeft className="inline-block mr-4 cursor-pointer hover:text-gray-600 transition-colors"  height={30} width={30}/>
          </div>
          : null}
          <div className='flex'>
            
          {/*name*/currentChat.name}
          
          {/*allow open the group infor when the currentChat is for a group*/}
          <InfoButton/>
          </div>
        </h1>
      </header>

      {/* Messages Container */}
      <main
        id="chatMessages"
        className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 scroll-smooth"
      >
        {response.status>=400 ? (
          <div className="flex-1 flex items-center justify-center text-center text-red-500">
            <div>
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-lg font-semibold mb-2">Error loading messages</h3>
              <p>{response.message}</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            <div>
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500">
            <div>
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p>Start the conversation with {currentChat.name}!</p>
            </div>
          </div>
        ) : (
          messages.map((msg: ChatBlockInfo, index: number) => (
          <ChatBlock chatBlockInfo={msg} key={index} />
          ))
        )}
      </main>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <form className="flex gap-3 items-center" id="messageForm" onSubmit={handleSubmit}>
          {/* Attachment Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all"
              aria-label="Attach file"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <button
              type="button"
              className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all"
              aria-label="Attach image"
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            id="fileInput"
            accept="*/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e, 'file')}
          />
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e, 'image')}
          />

          {/* Input Field */}
          <label htmlFor="messageInput" className="sr-only">
            Type your message
          </label>
          <input
            type="text"
            id="messageInput"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm font-normal focus:border-blue-500 focus:outline-none bg-white transition-colors"
            placeholder={attachedFile ? `Attached: ${attachedFile.name}` : "Type a message..."}
            aria-label="Message input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={!!attachedFile}
          />

          {/* Send Button */}
          <button
            type="submit"
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
            disabled={!inputValue && !attachedFile}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            
          </button>
          {attachedFile && (
              <button
                className='bg-red-500 rounded-full p-2'
                onClick={()=>{
                  setAttachedFile(false)
                  setInputValue("")
                }}
              ><XIcon height={30} width={30} fill="red"/></button>
            )}
          
        </form>
      </div> 
    </div>
    )
}
const GroupChatBody=(WrapppedComponent: any)=>{
  
  return function EnhancedComponent(props:any){
    const {currentUser, setLoading, setError, currentChat}= props;
    const dispatch= useAppDispatch()
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
  useEffect(() => {
    const fetchChats = async () => {
      if(currentChat.id>0){
        const chatBlocks= await getAllGroupChat(currentChat.id, currentUser.id, setResponse, setLoading);
        
        setMessages(chatBlocks)
      }else{
        toast.error("your id can't be defined")
      }
    };
    fetchChats();
  }, [currentUser.id, currentChat.groupId])
    //socket handle
    const groupMessage= useGetSocketData<GroupChatBlock>(socket, currentUser, "receiveGroupMessage");
    useEffect(()=>{
        if(groupMessage && groupMessage.groupId===currentChat.id){
        setMessages(messages=>[...messages, groupMessage])
        dispatch(popGroupChat(currentChat.id)); 

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
      {openInfoPage
      ?<div className='w-full lg:hidden h-full'><GroupInfomation group={currentChat} setOpenInfoPage={setOpenInfoPage} openInfoPage={openInfoPage}/></div>
      :<div className=' w-1/3 max-lg:hidden h-full'><GroupInfomation group={currentChat}/></div>
      }
      </>
      )
  }
}
const FriendChatBody=(WrappedComponent: any)=>{
  return function EnhancedComponent(props:any){
    const {currentUser, setLoading, setError, currentChat}= props;
    const dispatch= useAppDispatch()
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
  useEffect(() => {
    const fetchChats = async () => {
      if (currentChat.id >0) {
        const chatBlocks = await getAllChat(currentUser.id, currentChat.id, setResponse, setLoading);

        setMessages(chatBlocks);
      }else{
        toast.error("your id can't be identify")
      }
    };
    fetchChats();
  }, [currentChat.id, currentUser.id, currentChat.groupId])
  //handle socket send message
  const message= useGetSocketData<FriendChatBlock>(socket, currentUser, "receiveMessage");
  useEffect(()=>{
    if(message && message.senderId===currentChat.id){
      setMessages(messages=>[...messages, message]);
      
      dispatch(popFriendChat(currentChat.id));
      
    }else{
      console.log("unkown error")
    }
    return (()=>{
      dispatch(popFriendChat(currentChat.id));
      
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
