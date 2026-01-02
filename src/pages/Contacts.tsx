import React, { useState} from 'react';
import { Users, Globe, Mail, User, ArrowBigLeft } from 'lucide-react';
import FriendContactList from '@/components/FriendContactList';
import GroupList from '@/components/GroupList';
import GroupInvitation from '@/components/GroupInvitation';
import Invitations from '@/components/Invitations';
import AsideBar from '@/components/AsideBar';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { useAppSelector } from '@/redux/reduxHook';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
    { id: 'friends', label: 'Friend List', icon: Users },
    { id: 'groupsCommunities', label: 'Groups & Communities', icon: Globe },
    { id: 'friendRequests', label: 'Friend Request', icon: Mail },
    { id: 'groupRequests', label: 'Group Request', icon: User },
  ];

const pageComponents: Record<SidebarTab, React.FC> = {
    friends: FriendContactList,
    groupsCommunities: GroupList,
    friendRequests: Invitations,
    groupRequests: GroupInvitation,
  };
type SidebarTab = 'friends' | 'groupsCommunities' | 'friendRequests' | 'groupRequests';

const Contacts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('friends');
  const [openPage, setOpenPage]= useState<string>("Aside")
  const currentUser= useAppSelector(selectUserInfo).info;
  const navigate= useNavigate();
  if(currentUser.id<=0){
    navigate("/login");
  }
  return (
    <div className="flex h-full w-full bg-gray-100">
      <AsideBar/>
      {/* Sidebar */}
      <div className={`w-1/4 min-w-45 max-sm:${openPage==="Aside"?"min-w-full":"hidden"}  bg-white border-r-2 border-gray-200 flex flex-col`}>
        {sidebarItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setOpenPage("Functional");
                setActiveTab(item.id as SidebarTab)

              }}
              className={`flex items-center gap-4 px-5 py-5 border-b border-gray-200 transition-all ${
                activeTab === item.id
                  ? 'bg-green-50 border-l-4 border-l-green-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <Icon size={24} className={activeTab === item.id ? 'text-green-600' : 'text-green-500'} />
              <span className={`text-base font-medium ${activeTab === item.id ? 'text-green-700' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {(item.id === 'friendRequests' || item.id === 'groupRequests') && (
                <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                  3
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/*Functional Page*/}
      <div className={`max-sm:${openPage!=="Functional"? "hidden":""} w-full`}>
        <button 
        className='absolute top-9 sm:hidden z-1000'
        onClick={()=>{
          setOpenPage("Aside")
        }}>
          <ArrowBigLeft width={20} height={20}/>
        </button>
      {/* Main Content (render page based on active tab) */}
      {
        (() => {
          const Page = pageComponents[activeTab];
          return <Page  />;
        })()
      }
      </div>
    </div>
  );
};
export default Contacts;