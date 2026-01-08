import { useState, useEffect } from 'react';
import { getGroupInfo } from '@/lib/services/groupService';
import { useAppSelector } from '@/redux/reduxHook';
import { selectOnlineUserList } from '@/redux/slice/onlineUserSlice';



const GroupInfomation = ({ group }:any) => {
  const groupId= group.id;
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const currentOnlineUser = useAppSelector(selectOnlineUserList);

  const defaultConfig = {
    background_color: "#ffffff",
    primary_color: "#10b981",
    accent_color: "#059669",
    text_color: "#1f2937",
    surface_color: "#f0fdf4",
    font_family: "Plus Jakarta Sans",
    font_size: 16
  };

  useEffect(() => {
    const fetchGroupInfo = async () => {
      const data = await getGroupInfo(groupId, setError, setLoading);
      if (data ) {
        setGroupInfo(data);
        setMembers(data.groupMembers || []);
      }
    };
    fetchGroupInfo();
  }, [groupId]);
  
  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 768; // 48rem = 768px
      setIsLargeScreen(large);
      if (large) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-full flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!groupInfo) {
    return <div className="h-full flex items-center justify-center">No data available</div>;
  }

  return (
    <>
      <style>
        {`
          .online-indicator {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .scrollable-list {
            scrollbar-width: thin;
            scrollbar-color: rgba(34, 197, 94, 0.3) transparent;
          }
          
          .scrollable-list::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollable-list::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollable-list::-webkit-scrollbar-thumb {
            background-color: rgba(34, 197, 94, 0.3);
            border-radius: 3px;
          }
        `}
      </style>
      <aside className={`h-full flex flex-col ${isLargeScreen ? 'w-1/4' : isOpen ? 'w-full fixed inset-0 z-50 bg-white' : 'w-0 hidden'}`}>
        {!isLargeScreen && isOpen && (
          <div className="p-4 flex items-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
        {/* Group Header */}
        <div className="p-6 text-center" style={{ backgroundColor: defaultConfig.surface_color }}>
          <div className="flex justify-center mb-4">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg overflow-hidden"
              style={{ backgroundColor: defaultConfig.primary_color, color: defaultConfig.background_color }}
            >
              {groupInfo.adminProfilePic ? (
                <img src={groupInfo.adminProfilePic} alt="Group Avatar" className="w-full h-full object-cover" />
              ) : (
                '👥'
              )}
            </div>
          </div>
          <h1
            className={`text-2xl font-bold mb-1 ${!isLargeScreen ? 'cursor-pointer' : ''}`}
            style={{ color: defaultConfig.text_color, fontSize: `${defaultConfig.font_size * 1.5}px` }}
            onClick={() => !isLargeScreen && setIsOpen(true)}
          >
            {groupInfo.groupName}
          </h1>
        </div>

        {/* Group Description */}
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-70">About</h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: defaultConfig.text_color, fontSize: `${defaultConfig.font_size * 0.875}px` }}
          >
            {groupInfo.detail}
          </p>
        </div>

        {/* Group Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: defaultConfig.surface_color }}
            >
              <div className="text-2xl font-bold">
                {members.length}
              </div>
              <div className="text-xs opacity-70 mt-1">
                Total Members
              </div>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: defaultConfig.surface_color }}
            >
              <div className="text-sm font-semibold" style={{ color: defaultConfig.text_color }}>
                {groupInfo.adminName}
              </div>
              <div className="text-xs opacity-70 mt-1">
                Admin: 
                <button className=''
                >{groupInfo.adminName}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="px-6 py-4 flex-1 flex flex-col min-h-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-70">Members</h2>
          <div className="flex-1 overflow-y-auto scrollable-list space-y-2">
            {members.map((member, index) => {
              const isOnline = currentOnlineUser.includes(member.id);
              return (
                <div
                  key={member.id || index}
                  className="member-item flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:translate-x-1"
                  style={{ backgroundColor: defaultConfig.surface_color }}
                >
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl overflow-hidden"
                      style={{ backgroundColor: `${defaultConfig.primary_color}33` }}
                    >
                      {member.profilePic ? (
                        <img src={member.profilePic} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    {isOnline && (
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 online-indicator"
                        style={{
                          backgroundColor: defaultConfig.primary_color,
                          borderColor: defaultConfig.background_color
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-sm truncate"
                      style={{ color: defaultConfig.text_color }}
                    >
                      {member.name}
                    </div>
                    <div
                      className="text-xs opacity-60"
                      style={{ color: defaultConfig.text_color }}
                    >
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default GroupInfomation;