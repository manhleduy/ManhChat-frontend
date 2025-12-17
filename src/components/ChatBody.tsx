import React, { useEffect, useState } from 'react';
import ChatBlock from './ChatBlock';
import { ChevronLeft } from 'lucide-react';
import { useAppSelector } from '@/redux/reduxHook';
import { getAllChat } from '@/lib/services/chatService';
import { selectUserInfo } from '@/redux/userSlice';
import type { ChatBlockInfo } from '@/lib/const';
import { useAppDispatch } from '@/redux/reduxHook';
import { Login } from '@/lib/services/userService';
import { createChat } from '@/lib/services/chatService';
import type { UserLoginInfo } from '@/lib/const';
interface Response{
  message:string,
  status: number
}


const ChatBody = (
  
  { onlyMode, setOpenPage, currentChat }: 
  { onlyMode: boolean; setOpenPage: any; currentChat: any }) => {
  
  const currentUser = useAppSelector(selectUserInfo).info;
  const [messages, setMessages] = useState<ChatBlockInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse]= useState<Response>({message:"", status:0});
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile]= useState<string>('');
  
  const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue || inputValue.length<=250) { 
        const newMessage :ChatBlockInfo  = {
          content: inputValue,
          senderId: currentUser.id,
          receiverId: currentChat.id
        };
        await createChat(newMessage,setResponse, setLoading);
        setInputValue('');
    }
  };
  
  useEffect(() => {
    const fetchChats = async () => {
      if (currentChat.id >0) {
        const chatBlocks = await getAllChat(currentUser.id, currentChat.id, setResponse, setLoading);
        setMessages(chatBlocks);
      }
    };
    fetchChats();
  }, [currentChat.id, currentUser.id]);
  console.log(messages);
  console.log(currentUser);
  return (
    <div className={`w-full h-full flex flex-col  overflow-hidden`} >
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-200 bg-gray-50">
        <h1 className=" flex text-2xl font-semibold text-gray-900" id="chatTitle">
          {onlyMode
          ?<div onClick={() => {setOpenPage("FriendList"); }}>
          <ChevronLeft className="inline-block mr-4 cursor-pointer hover:text-gray-600 transition-colors"  height={30} width={30}/>
          </div>
          : null}
          {currentChat.name}
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
          messages.map(msg => (
            
              msg.senderId!==currentUser.id ?(
              <div className='flex justify-start'>
                <ChatBlock
                  key={msg.id}
                  username={currentUser.name}
                  message={msg.content}
                  timestamp={msg.createdAt|| ""}
                  isSent={msg.isRead|| false}
                />
              </div>
              ):(
              <div className='flex justify-end'>
                <ChatBlock
                  key={msg.id}
                  username={currentChat.name}
                  message={msg.content}
                  timestamp={msg.createdAt|| ""}
                  isSent={msg.isRead|| false}
                />
              </div>
              )
              
              
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

          {/* Input Field */}
          <label htmlFor="messageInput" className="sr-only">
            Type your message
          </label>
          <input
            type="text"
            id="messageInput"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm font-normal focus:border-blue-500 focus:outline-none bg-white transition-colors"
            placeholder="Type a message..."
            aria-label="Message input"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />

          {/* Send Button */}
          <button
            type="submit"
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
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
        </form>
      </div>
    </div>
  );
};

export default ChatBody;
