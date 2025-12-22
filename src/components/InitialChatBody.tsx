import React from 'react';

const InitialChatBody: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-linear-to-br from-indigo-500 to-purple-600 text-white text-center">
      <div className="mb-12">
        <div className="text-6xl mb-4 animate-bounce">
          💬
        </div>
        <h2 className="text-4xl font-bold mb-2">Welcome to Your Chat App!</h2>
        <p className="text-lg opacity-90">Start a conversation with your friends or join a group chat.</p>
      </div>
      <div className="flex gap-8 mb-12">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <span className="text-3xl">👥</span>
          <span>Connect with Friends</span>
        </div>
        <div className="flex flex-col items-center gap-2 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <span className="text-3xl">📱</span>
          <span>Real-time Messaging</span>
        </div>
        <div className="flex flex-col items-center gap-2 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <span className="text-3xl">🔒</span>
          <span>Secure & Private</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-start max-w-xs">
        <div className="bg-white/20 p-3 rounded-xl rounded-bl-sm opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-600" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Hey there! 👋</div>
        <div className="bg-white/30 p-3 rounded-xl rounded-br-sm self-end opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-600" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>Ready to chat?</div>
        <div className="bg-white/20 p-3 rounded-xl rounded-bl-sm opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-600" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>Let's get started! 🚀</div>
      </div>
    </div>
  );
};

export default InitialChatBody;