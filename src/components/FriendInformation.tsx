import React, { useState } from 'react';
import { User, ArrowLeftCircle, UserRoundX } from 'lucide-react';
import type { UserDefaultInfo } from '@/lib/const';
import ConfirmButton from './Confirmbutton';
import toast from 'react-hot-toast';
import { unFriend } from '@/lib/services/friendService';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { useAppSelector } from '@/redux/reduxHook';

interface FriendInformationProps {
  userInfo: UserDefaultInfo;
  setOpenInfoPage:(value:boolean)=>void;
}


const FriendInformation: React.FC<FriendInformationProps> = ({ userInfo, setOpenInfoPage }) => {
  const [openConfirm, setOpenConfirm]= useState(false);
  const [error, setError]= useState<string>("");
  const [loading, setLoading]= useState<boolean>(false);
  const currentUser= useAppSelector(selectUserInfo).info;

  const handleDeleteFriend=async()=>{
    try{
      await unFriend({userId: currentUser.id, friendId: userInfo.id}, setError, setLoading)
      toast.success("your have delete your friend");
      setOpenInfoPage(false);

    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-green-200 absolute rounded-lg shadow-lg p-6  max-w-md w-full mx-4">
        <div className='absolute top-1 right-1 cursor-pointer'>
          <ConfirmButton
            acceptFunc={handleDeleteFriend}
            cancelFunc={()=>setOpenConfirm(false)}
            openConfirm={openConfirm}
            setOpenConfirm={setOpenConfirm}
            size={6}
            icon={<UserRoundX height={20} width={10} />}
          />
        </div>
        <div className='absolute top-1 left-1'>
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