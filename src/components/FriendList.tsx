import { useEffect, useState } from 'react';
import { FriendListConfig } from '@/lib/const';
import type { UserDefaultInfo } from '@/lib/const';
interface Friend extends UserDefaultInfo{
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  
};
const COLOR=['#ff6b9d', '#4a90e2', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', "#2ecc71", "#8e44ad"];
const initialFriends: Friend[] = [
  { id: "1", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Sarah Johnson', profilePic: 'SJ', lastMessage: 'See you tomorrow!', time: '2m', unread: 3, online: true},
  { id: "2", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Mike Chen', profilePic: 'MC', lastMessage: 'Thanks for your help!', time: '15m', unread: 0, online: true},
  { id: "3", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Emma Davis', profilePic: 'ED', lastMessage: 'That sounds great 👍', time: '1h', unread: 1, online: false},
  { id: "4", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Alex Rodriguez', profilePic: 'AR', lastMessage: "Let me know", time: '3h', unread: 0, online: true},
  { id: "5", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Jessica Lee', profilePic: 'JL', lastMessage: 'Happy birthday! 🎉', time: '5h', unread: 0, online: false},
  { id: "6", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Tom Wilson', profilePic: 'TW', lastMessage: "I'll send it over", time: '1d', unread: 0, online: true},
  { id: "7", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Lisa Brown', profilePic: 'LB', lastMessage: 'Perfect, thanks!', time: '2d', unread: 0, online: false},
  { id: "8", address:"ha noi", phonenumber:"0904", email:"example@gmail.com",birthday:"2025", name: 'Chris Taylor', profilePic: 'CT', lastMessage: 'Can we reschedule?', time: '3d', unread: 2, online: false},
];

const FriendList= ({onlyMode, setOpenPage}:{onlyMode:boolean, setOpenPage:any}) => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [config, setConfig] = useState<typeof FriendListConfig>(FriendListConfig);

  useEffect(() => {
    const sdk = (window as any).elementSdk;
    if (!sdk) return;

    const onConfigChange = (newConfig: any) => setConfig(prev => ({ ...prev, ...newConfig }));

    try {
      sdk.init({
        defaultConfig: FriendListConfig,
        onConfigChange,
        mapToCapabilities: (cfg: any) => ({
          recolorables: [
            { get: () => cfg.background_color || FriendListConfig.background_color, set: (v: string) => { cfg.background_color = v; sdk.setConfig({ background_color: v }); } },
            { get: () => cfg.surface_color || FriendListConfig.surface_color, set: (v: string) => { cfg.surface_color = v; sdk.setConfig({ surface_color: v }); } },
            { get: () => cfg.text_color || FriendListConfig.text_color, set: (v: string) => { cfg.text_color = v; sdk.setConfig({ text_color: v }); } },
            { get: () => cfg.primary_color || FriendListConfig.primary_color, set: (v: string) => { cfg.primary_color = v; sdk.setConfig({ primary_color: v }); } },
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined,
        }),
        mapToEditPanelValues: (cfg: any) => new Map([
          ['sidebar_title', cfg.sidebar_title || FriendListConfig.sidebar_title],
          ['search_placeholder', cfg.search_placeholder || FriendListConfig.search_placeholder],
        ]),
      });
    } catch (err) {
      // ignore init errors
      // eslint-disable-next-line no-console
      console.warn('elementSdk init failed', err);
    }
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setFriends(prev => prev.map(f => (f.id === id ? { ...f, unread: 0 } : f)));
  };

  const displayedFriends = friends.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`min-w-[300px] h-full  flex flex-col ${onlyMode? "w-full ":"w-2/12"}`} style={{ background: config.background_color }}>
      <header className="px-5 py-4 border-b border-gray-200" role="banner">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3" id="sidebarTitle">{config.sidebar_title}</h1>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <label htmlFor="searchInput" className="sr-only">Search messages</label>
          <input
            id="searchInput"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-gray-200 text-sm outline-none"
            placeholder={config.search_placeholder}
            aria-label="Search conversations"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto" role="main" aria-label="Friends list">
        <div className="py-2">
          {displayedFriends.map((friend,index) => (
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: COLOR[index % COLOR.length] }}>
                  {friend.profilePic}
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default FriendList;
