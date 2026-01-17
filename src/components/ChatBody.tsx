import React, { useEffect, useState, useRef } from 'react';
import { InfoIcon } from 'lucide-react';
import { useAppSelector } from '@/redux/reduxHook';
import { markAsRead, createChat,createGroupChat } from '@/lib/services/chatService';
import { selectUserInfo } from '@/redux/slice/userSlice';
import type { GroupChatBlock, FriendChatBlock, GroupDefaultInfo } from '@/lib/const';
import toast from 'react-hot-toast';
import socket from '@/lib/socket';
import { api } from '@/lib/axios';
import GroupInfomation from './GroupInfomation';
import FriendInformation from './FriendInformation';
import BaseChatBody from './BaseChatBody';
import type { MessageType } from '@/lib/const';
import { useFetch, useListenSocket } from '@/hook/reacthook';

interface Response{
  message:string,
  status: number
}

//GROUP CHAT BODY
const GroupChatBody=(WrapppedComponent: any)=>{

  return function EnhancedComponent(props:any){
    const {currentUser, setLoading, setError, currentChat}= props;
    const [messages, setMessages]= useState<MessageType[]>([]);
    const [response, setResponse]= useState<Response>({message:"", status:0});
    const [inputValue, setInputValue] = useState<string>('');
    const [openInfoPage, setOpenInfoPage]= useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    // Initial load - fetch first 20 messages
    const {data: initialData, error: initialError, loading: initialLoading}= useFetch<MessageType[]>(
      `/api/chat/group/${currentChat.id}`,
      "post",
      [],
      {memberId: currentUser.id, limit: 20, offset: 0}
    );

    useEffect(() => {
      if (initialData && initialData.length > 0) {
        setMessages(initialData);
        setHasMore(initialData.length === 20);
        setPage(1);
      }
    }, [initialData]);

    // Load more messages function
    const loadMoreMessages = async () => {
      if (loadingMore || !hasMore) return;

      setLoadingMore(true);
      try {
        const response = await api.post(`/api/chat/group/${currentChat.id}`, {
          memberId: currentUser.id,
          limit: 20,
          offset: page * 20
        });

        const olderMessages: MessageType[] = response.data;
        if (olderMessages.length > 0) {
          setMessages(prev => [...olderMessages, ...prev]);
          setPage(prev => prev + 1);
          setHasMore(olderMessages.length === 20);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load more messages:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    useListenSocket<GroupChatBlock>(
      socket, 
      currentUser, 
      "receiveGroupMessage",
      (data: GroupChatBlock)=>{
          if(data && data.groupId===currentChat.id){
            setMessages(prev=>[...prev, data])
          }else{
            console.log("unkown error")
          }
      }
    );
    //SOCKET: deleted handle
    useListenSocket<{chatblockId:number, groupId: number}>(
      socket,
      currentUser,
      "recallGroupMessage",
      (data: {chatblockId:number, groupId: number})=>{
        if(data && data.groupId===currentChat.id){
          setMessages(prev=>prev.filter(item=>item.id!=data.chatblockId))
        }else{
          console.log("unkown error")
        }
      }
    );
    
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
      setMessages(prev=>[...prev, newMessage])
      setInputValue('');
      setAttachedFile(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
    
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
      onLoadMore={loadMoreMessages}
      loading={initialLoading}
      prevScrollHeight={prevScrollHeight}
      setPrevScrollHeight={setPrevScrollHeight}
    
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
    const [response, setResponse]= useState<Response>({message:"", status:0});
    const [inputValue, setInputValue] = useState<string>('');
    const [openInfoPage, setOpenInfoPage]= useState(false);
    const [messages, setMessages]= useState<MessageType[]>([]);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    // Initial load - fetch first 20 messages
    const {data: initialData, error: initialError, loading: initialLoading}= useFetch<MessageType[]>(
      `/api/chat/${currentUser.id}`,
      "post",
      [],
      {receiverId: currentChat.id, limit: 20, offset: 0}
    );

    useEffect(() => {
      if (initialData && initialData.length > 0) {
        setMessages(initialData);
        setHasMore(initialData.length === 20);
        setPage(1);
      }
    }, [initialData]);

    // Load more messages function
    const loadMoreMessages = async () => {
      if (loadingMore || !hasMore) return;

      setLoadingMore(true);
      try {
        const response = await api.post(`/api/chat/${currentUser.id}`, {
          receiverId: currentChat.id,
          limit: 20,
          offset: page * 20
        });

        const olderMessages: MessageType[] = response.data;
        if (olderMessages.length > 0) {
          setMessages(prev => [...olderMessages, ...prev]);
          setPage(prev => prev + 1);
          setHasMore(olderMessages.length === 20);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load more messages:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    //SOCKET :receive message
  useListenSocket<FriendChatBlock>(
    socket,
    currentUser,
    "receiveMessage",
    (data: FriendChatBlock)=>{
        if(data && data.senderId===currentChat.id){
          setMessages(prev=>[...prev, data])
        }else{
          console.log("unkown error")
        }
    }
  )
  //SOCKET: recall message
  useListenSocket<{chatBlockId:number, senderId:number}>(
    socket,
    currentUser,
    "recallMessage",
    (data: {chatBlockId:number, senderId:number})=>{
      if(data && data.senderId===currentChat.id){
        setMessages(prev=>prev.filter(item=>item.id!=data.chatBlockId))
      }else{
        console.log("unkown error");
      }
    }
  )
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
      
      await createChat(newMessage, setResponse, setLoading);
      setMessages(prev=>[...prev, newMessage])
      //
      setInputValue('');
      setAttachedFile(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  //allow open information card
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
      onLoadMore={loadMoreMessages}
      loading={initialLoading}
      prevScrollHeight={prevScrollHeight}
      setPrevScrollHeight={setPrevScrollHeight}

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
