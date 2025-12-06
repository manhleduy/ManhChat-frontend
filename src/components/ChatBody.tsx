import React, { useEffect, useState } from 'react';
import ChatBlock from './ChatBlock';
import {ChevronLeft} from 'lucide-react'

type Message = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  isSent: boolean;
};

const defaultConfig = {
  chat_title: 'Team Chat',
  user1_name: 'Sarah',
  user1_message: "Hey everyone! How's the project coming along?",
  user2_name: 'Mike',
  user2_message: 'Going great! Just finished the design mockups. Ready to review?',
  user3_name: 'Emma',
  user3_message: "Perfect timing! I'll take a look now and give you my feedback 👍",
};

const ChatBody= ({onlyMode, setOpenPage}:{onlyMode:boolean, setOpenPage: any}) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, username: defaultConfig.user1_name, message: defaultConfig.user1_message, timestamp: '10:30 AM', isSent: false },
    { id: 2, username: defaultConfig.user2_name, message: defaultConfig.user2_message, timestamp: '10:32 AM', isSent: true },
    { id: 3, username: defaultConfig.user3_name, message: defaultConfig.user3_message, timestamp: '10:35 AM', isSent: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [config, setConfig] = useState<typeof defaultConfig>(defaultConfig);

  useEffect(() => {
    const sdk = (window as any).elementSdk;
    if (!sdk) return;

    const onConfigChange = (newConfig: any) => {
      setConfig(prev => ({ ...prev, ...newConfig }));
      // Update messages with new config
      setMessages(prev => [
        { ...prev[0], username: newConfig.user1_name || defaultConfig.user1_name, message: newConfig.user1_message || defaultConfig.user1_message },
        { ...prev[1], username: newConfig.user2_name || defaultConfig.user2_name, message: newConfig.user2_message || defaultConfig.user2_message },
        { ...prev[2], username: newConfig.user3_name || defaultConfig.user3_name, message: newConfig.user3_message || defaultConfig.user3_message },
      ]);
    };

    try {
      sdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: () => ({
          recolorables: [],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined,
        }),
        mapToEditPanelValues: (cfg: any) =>
          new Map([
            ['chat_title', cfg.chat_title || defaultConfig.chat_title],
            ['user1_name', cfg.user1_name || defaultConfig.user1_name],
            ['user1_message', cfg.user1_message || defaultConfig.user1_message],
            ['user2_name', cfg.user2_name || defaultConfig.user2_name],
            ['user2_message', cfg.user2_message || defaultConfig.user2_message],
            ['user3_name', cfg.user3_name || defaultConfig.user3_name],
            ['user3_message', cfg.user3_message || defaultConfig.user3_message],
          ]),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('elementSdk init failed', err);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const newMessage: Message = {
        id: messages.length + 1,
        username: 'You',
        message: inputValue,
        timestamp: timeString,
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 0);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col  overflow-hidden`} >
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-200 bg-gray-50">
        <h1 className=" flex text-2xl font-semibold text-gray-900" id="chatTitle">
          {onlyMode
          ?<div onClick={() => setOpenPage("FriendList")}>
          <ChevronLeft className="inline-block mr-4 cursor-pointer hover:text-gray-600 transition-colors"  height={30} width={30}/>
          </div>
          : null}
          {config.chat_title}
        </h1>
      </header>

      {/* Messages Container */}
      <main
        id="chatMessages"
        className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 scroll-smooth"
      >
        {messages.map(msg => (
          <ChatBlock
            key={msg.id}
            username={msg.username}
            message={msg.message}
            timestamp={msg.timestamp}
            isSent={msg.isSent}
          />
        ))}
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
