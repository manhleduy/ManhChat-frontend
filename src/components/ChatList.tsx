import { useEffect, useState } from 'react';
import { FriendListConfig } from '@/lib/const';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHook';
import { getFriendList } from '@/lib/services/friendService';
import { selectFriendList } from '@/redux/slice/FriendListSlice';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { getAllGroup } from '@/lib/services/groupService';
import { selectGroupList } from '@/redux/slice/GroupListSlice';
import { ArrowDown, ArrowUp, Group } from 'lucide-react';
import { selectOnlineUserList } from '@/redux/slice/onlineUserSlice';
import socket from '@/lib/socket';
import { useDebounce } from '@/hook/reacthook';

const COLOR=['#ff6b9d', '#4a90e2', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', "#2ecc71", "#8e44ad"];



const BaseList=(props: any)=>{
  const {
    query,
    onlyMode,
    config,
    setOpenList,
    openList,
    displayList,
    activeId,
    setOpenPage,
    handleSelect,
    setCurrentChat,
    }= props;
  return(
    <>
          <button 
          onClick={()=>{
            setOpenList(!openList)}}
          className=' flex justify-between w-full text-black p-2 items-center'>
            <div>{config.label}</div>
            {openList?<ArrowUp height={15} width={15}/>:<ArrowDown height={15} width={15}/>}
          </button>
          {openList? displayList.filter((item:any)=>item.name.toLowerCase().includes(query.toLowerCase())).map((item:any,index:number) => (
            
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`${item.name}, ${item.unread > 0 ? `${item.unread} unread messages` : 'no unread messages'}`}
              onClick={() =>{
                if(onlyMode){
                  setOpenPage("ChatBody")
                  console.log("chat body");
                }
                handleSelect(item.id);
                setCurrentChat(item)
              }
              }
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                handleSelect(item.id); } }}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${item.id === activeId ? 'bg-sky-50' : ''} ${item.unread > 0 ? '' : ''}`}
            >
              <div className="relative shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: COLOR[index % COLOR.length] }}>
                  {item.profilePic}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${item.online ? 'bg-green-500' : 'bg-gray-400'}`} aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                <p className={`text-sm truncate ${item.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{item.lastMessage}</p>
              </div>

              <div className="flex items-center ml-3">
                <span className="text-xs text-gray-500 ml-2">{item.time}</span>
                {item.unread > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ml-2 text-white" style={{ background: FriendListConfig.primary_color }}>{item.unread}</span>
                )}
              </div>
            </div>
          )): null}
    </>
  )
}
const GetFriendList= (WrappedComponent:any)=>{
  return function EnhancedComponent(props:any){
    const dispatch=useAppDispatch();
    const [openList, setOpenList]= useState(true)
    const {currentUser, setActiveUserId, setActiveGroupId}= props;
    //friend list  config
    const config={
      label: "Friends",

    }
    //handle select user
    const handleSelectUser= (id: number)=>{
      setActiveUserId(id);
      setActiveGroupId(0);
    }
    //final display friend list
    const friendList= useAppSelector(selectFriendList).friendList
    const currentOnlineUsers= useAppSelector(selectOnlineUserList);
    const displayedFriends= friendList?.map((item)=>{
    return {
       ...item,
       lastMessage:"con me may",
       time:"25/10",
       unread:1,
       online: currentOnlineUsers.includes(item.id)?true: false
       }
    })
    useEffect(()=>{
      dispatch(getFriendList(currentUser.id));
    },[])
    return (
      <WrappedComponent
      setOpenList= {setOpenList}
      openList= {openList}
      displayList= {displayedFriends}
      handleSelect={handleSelectUser}
      config={config}
      {...props}/>
    )
  }

  }

const GetGroupList=(WrappedComponent:any)=>{
  return function EnhancedComponent(props:any){
    const dispatch=useAppDispatch();
    const [openList,setOpenList]= useState(true)
    const {currentUser, setActiveGroupId, setActiveUserId}= props;
    //group list config
    const config={
      label: "Groups",

    }
    //handle select group
    const handleSelectGroup=(id:number)=>{
      setActiveGroupId(id);
      setActiveUserId(0);
    }
    //final display group list
    const groupList= useAppSelector(selectGroupList).groupList;
    const displayedGroups= groupList?.map((item)=>{
      return {
        ...item,
        name: item.groupName,
        lastMessage:"con me may",
        time:"26/10",
        unread:1,
        online:false
      }
    })
    useEffect(()=>{
      dispatch(getAllGroup(currentUser.id));
    },[]) 

    //socket join group
    useEffect(()=>{
        socket.emit("joinGroup", groupList.map((item)=>{
          return {groupName: item.groupName, groupId: item.id}
        }));
        return()=> socket.off("joinGroup");
    },[groupList,socket])
    return(
      <WrappedComponent
      setOpenList= {setOpenList}
      openList={openList}
      displayList= {displayedGroups}
      handleSelect={handleSelectGroup}
      config={config}
      {...props}/>
    )
  }
}
const ChatList= ({onlyMode, setOpenPage, setCurrentChat}:{onlyMode:boolean, setOpenPage:any, setCurrentChat: any}) => {

 
  const currentUser= useAppSelector(selectUserInfo).info;//public
  const [activeUserId, setActiveUserId] = useState<number | null>(null);//public
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);//public
  const [query, setQuery] = useState<string>('');//public
  const queryValue= useDebounce(query, 500);

  
  // join all group
  const FriendList= GetFriendList(BaseList);
  const GroupList= GetGroupList(BaseList);
  
  return (
    //query to find the group and friend
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
            onChange={e => {
              setQuery(e.target.value);
              
            }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto" role="main" aria-label="Friends list">
        
        <div className="py-2">
          {/*list of friend*/}
          <FriendList
          setActiveGroupId={setActiveGroupId}
          setActiveUserId={setActiveUserId}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
          activeId={activeUserId}
          setOpenPage={setOpenPage}
          onlyMode={onlyMode}
          query={queryValue}
          />
          {/*list of group*/}
          <GroupList
          setActiveGroupId={setActiveGroupId}
          setActiveUserId={setActiveUserId}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
          activeId={activeGroupId}
          setOpenPage={setOpenPage}
          onlyMode={onlyMode}
          query={queryValue}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatList;
