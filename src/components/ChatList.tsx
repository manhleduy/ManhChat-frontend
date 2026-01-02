import { useEffect, useState } from 'react';
import { FriendListConfig } from '@/lib/const';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { getFriendList } from '@/lib/services/friendService';
import { selectFriendList } from '@/redux/slice/FriendListSlice';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { getAllGroup } from '@/lib/services/groupService';
import { selectGroupList } from '@/redux/slice/GroupListSlice';
import { ArrowDown, ArrowUp } from 'lucide-react';

const COLOR=['#ff6b9d', '#4a90e2', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', "#2ecc71", "#8e44ad"];


const FriendList= ({onlyMode, setOpenPage, setCurrentChat}:{onlyMode:boolean, setOpenPage:any, setCurrentChat: any}) => {

  const friendList= useAppSelector(selectFriendList).friendList;
  const groupList= useAppSelector(selectGroupList).groupList;
  const currentUser= useAppSelector(selectUserInfo).info;
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [query, setQuery] = useState<string>('');
  const [openFriendList, setOpenFriendList]=useState(true);
  const [openGroupList, setOpenGroupList]= useState(false);
  const dispatch= useAppDispatch()
     
  
 
  useEffect(()=>{
      dispatch(getFriendList(currentUser.id));
      dispatch(getAllGroup(currentUser.id))
  },[])
  

  const displayedFriends= friendList?.map((item)=>{
    return {
       ...item,
       lastMessage:"con me may",
       time:"25/10",
       unread:1,
       online: false
       }
  })
  const displayedGroups= groupList?.map((item)=>{
    return {
      ...item,
      lastMessage:"con me may",
      time:"26/10",
      unread:1,
      online:false
    }
  })

    
    
  const handleSelectUser = (id: number) => {
    setActiveUserId(id);
    setActiveGroupId(null);
  };
  const handleSelectGroup=(id:number)=>{
    setActiveGroupId(id)
    setActiveUserId(null);

  }

  
  if(!friendList || !groupList) return <div>loading</div>
  return (
    <div className={`min-w-[300px] h-full  flex flex-col ${onlyMode? "w-full ":"w-2/12"}`} style={{ background: FriendListConfig.background_color }}>
      <header className="px-5 py-4 border-b border-gray-200" role="banner">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3" id="sidebarTitle">{FriendListConfig.sidebar_title}</h1>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <label htmlFor="searchInput" className="sr-only">Search messages</label>
          <input
            id="searchInput"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-gray-200 text-sm outline-none"
            placeholder={FriendListConfig.search_placeholder}
            aria-label="Search conversations"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto" role="main" aria-label="Friends list">
        
        <div className="py-2">
          {/*list of friend*/}
          <button 
          onClick={()=>{setOpenFriendList(!openFriendList)}}
          className=' flex justify-between w-full text-black p-2 items-center'>
            <div>Friends</div>
            {openFriendList?<ArrowUp height={15} width={15}/>:<ArrowDown height={15} width={15}/>}
          </button>
          {openFriendList? displayedFriends.map((friend,index) => (
            //friend id cha
            <div
              key={friend.id}
              role="button"
              tabIndex={0}
              aria-label={`${friend.name}, ${friend.unread > 0 ? `${friend.unread} unread messages` : 'no unread messages'}`}
              onClick={() =>{
                if(onlyMode)setOpenPage("ChatBody");
                handleSelectUser(friend.id);
                setCurrentChat(friend)
              }
              }
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectUser(friend.id); } }}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${friend.id === activeUserId ? 'bg-sky-50' : ''} ${friend.unread > 0 ? '' : ''}`}
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
                  <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ml-2 text-white" style={{ background: FriendListConfig.primary_color }}>{friend.unread}</span>
                )}
              </div>
            </div>
          )): null}
          {/*list of group*/}
          <button 
          onClick={()=>{setOpenGroupList(!openGroupList)}}
          className=' flex justify-between w-full text-black p-2 items-center'>
            <div>Groups</div>
            {openGroupList?<ArrowUp height={15} width={15}/>:<ArrowDown height={15} width={15}/>}
          </button>
          {openGroupList? displayedGroups.map((group,index) => (
          
            <div
              key={group.id}
              role="button"
              tabIndex={0}
              aria-label={`${group.groupName}, ${group.unread > 0 ? `${group.unread} unread messages` : 'no unread messages'}`}
              onClick={() =>{
                if(onlyMode)setOpenPage("ChatBody");
                handleSelectGroup(group.id);
                setCurrentChat(group)
              }
              }
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelectGroup(group.id); } }}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${group.id === activeGroupId ? 'bg-sky-50' : ''} ${group.unread > 0 ? '' : ''}`}
            >
              <div className="relative shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: COLOR[index % COLOR.length] }}>
                  {group.groupName.slice(0,1)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${group.online ? 'bg-green-500' : 'bg-gray-400'}`} aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{group.groupName}</p>
                <p className={`text-sm truncate ${group.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{group.lastMessage}</p>
              </div>

              <div className="flex items-center ml-3">
                <span className="text-xs text-gray-500 ml-2">{group.time}</span>
                {group.unread > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ml-2 text-white" style={{ background: FriendListConfig.primary_color }}>{group.unread}</span>
                )}
              </div>
            </div>
          )): null}
        </div>
      </main>
    </div>
  );
};

export default FriendList;
