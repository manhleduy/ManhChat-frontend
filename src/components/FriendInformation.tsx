import React from 'react';
import { User, ArrowLeftCircle } from 'lucide-react';
import type { UserDefaultInfo } from '@/lib/const';

interface FriendInformationProps {
  userInfo: UserDefaultInfo;
  setOpenInfoPage:(value:boolean)=>void;
}

const FriendInformation: React.FC<FriendInformationProps> = ({ userInfo, setOpenInfoPage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-green-200 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className='relative top-1 left-1'>
            <button onClick={()=>{setOpenInfoPage(false)}}>
                <ArrowLeftCircle height={25} width={25}/>
            </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
            {userInfo.profilePic ? (
              <img src={userInfo.profilePic} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-500" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{userInfo.name}</h2>
          <div className="w-full space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">Phone:</span> {userInfo.phonenumber}
            </div>
            <div>
              <span className="font-medium">Address:</span> {userInfo.address}
            </div>
            <div>
              <span className="font-medium">Birthday:</span> {userInfo.birthday ? new Date(userInfo.birthday).toLocaleDateString() : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {userInfo.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendInformation;