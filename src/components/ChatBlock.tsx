import React from 'react';

type ChatBlockProps = {
  username: string;
  message: string;
  timestamp: string;
  isSent: boolean;
};

const ChatBlock: React.FC<ChatBlockProps> = ({ username, message, timestamp, isSent }) => {
  return (
    <div className={`flex gap-2 items-start ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex flex-col max-w-xs ${isSent ? 'items-end' : 'items-start'} animate-[slideIn_0.3s_ease-out]`}
      >
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-sm font-semibold text-green-600">{username}</span>
          <span className="text-xs text-gray-400">{timestamp}</span>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word ${
            isSent
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          {message}
        </div>
      </div>

      <button
        className="opacity-0 hover:opacity-100 transition-opacity duration-200 shrink-0"
        aria-label="Message options"
      >
        <div className="w-8 h-8 border border-gray-300 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-500 transition-all">
          <div className="relative w-1 h-1 bg-gray-500 rounded-full">
            <span className="absolute w-1 h-1 bg-gray-500 rounded-full -top-1.5 left-1/2 -translate-x-1/2"></span>
            <span className="absolute w-1 h-1 bg-gray-500 rounded-full top-1.5 left-1/2 -translate-x-1/2"></span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ChatBlock;
