import ChatBlock from './ChatBlock';
import { ChevronLeft, InfoIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import type {ChatBlockInfo} from '@/lib/const';
import { motion } from "framer-motion";

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
        onLoadMore,
        loadingMore,
        prevScrollHeight,
        setPrevScrollHeight,
      }= props;

      const scrollRef = useRef<HTMLDivElement>(null);

      // Handle the "Stay in place" logic - maintain scroll position when messages are added to top
      useLayoutEffect(() => {
        const container = scrollRef.current;
        if (container && prevScrollHeight > 0) {
          // Calculate how much height was added to the top
          const heightAdded = container.scrollHeight - prevScrollHeight;
          // Offset the scroll so the user doesn't move
          container.scrollTop = heightAdded;
        }
      }, [messages]); // Runs every time messages are added

      const handleScroll = () => {
        const container = scrollRef.current;

        // Detect when user hits the top
        if (container && container.scrollTop === 0 && onLoadMore) {
          // Store current scroll height before adding messages
          setPrevScrollHeight(container.scrollHeight);
          onLoadMore();
        }
      };

      // Auto-scroll to bottom for new messages (only when user is already at bottom)
      useEffect(() => {
        const container = scrollRef.current;
        if (container) {
          const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
          if (isAtBottom) {
            container.scrollTop = container.scrollHeight;
          }
        }
      }, [messages]);
      
    return (
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className={`w-full h-full flex flex-col  overflow-hidden max-lg:${openInfoPage? "hidden": ""}`} >
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
        ref={scrollRef}
        onScroll={handleScroll}
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
          <div className="space-y-3 sm:space-y-4">
            {loadingMore && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin text-xl sm:text-2xl">⏳</div>
                <span className="ml-2 text-sm sm:text-base text-gray-500">Loading older messages...</span>
              </div>
            )}
            {messages.map((msg: ChatBlockInfo, index: number) => (
              <ChatBlock chatBlockInfo={msg} key={msg.id || `msg-${index}`} />
            ))}
          </div>
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
    </motion.div>
    )
}
export default BaseChatBody