import React from 'react'

const FriendCard = ({friend, setOpenPage, handleSelect, config, activeId}: any) => {
  return (
    <div
              key={friend.id}
              role="button"
              tabIndex={0}
              aria-label={`${friend.name}, ${friend.unread > 0 ? `${friend.unread} unread messages` : 'no unread messages'}`}
              onClick={() =>{
                setOpenPage("ChatBody");
                handleSelect(friend.id)
              }
              }
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(friend.id); } }}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${friend.id === activeId ? 'bg-sky-50' : ''} ${friend.unread > 0 ? '' : ''}`}
            >
              <div className="relative shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: friend.color }}>
                  {friend.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${friend.online ? 'bg-green-500' : 'bg-gray-400'}`} aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{friend.name}</p>
                <p className={`text-sm truncate ${friend.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{friend.lastMessage}</p>
              </div>

              <div className="flex items-center ml-3">
                <span className="text-xs text-gray-500 ml-2">{friend.time}</span>
                {friend.unread > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ml-2 text-white" style={{ background: config.primary_color }}>{friend.unread}</span>
                )}
              </div>
            </div>
  )
}

export default FriendCard