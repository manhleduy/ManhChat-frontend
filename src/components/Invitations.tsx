import { useEffect, useState } from 'react';
import InvitationCard from './InvitationCard';
import { UserPlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import InvitationForm from './InvitationForm';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';
import { selectFriendRequest } from '@/redux/FriendRequestSlice';
import { selectUserInfo } from '@/redux/userSlice';
import type { FriendRequest, RequestType } from '@/lib/const';
import { acceptInvitation, deleteInvitation, getAllRequest } from '@/lib/services/invitationService';
import toast from 'react-hot-toast';
import { set } from 'zod';

const Invitations =() => {
  const [openInviteForm, setOpenInviteForm]=useState(false);
  const currentUser= useSelector(selectUserInfo).info;
  const dispatch= useAppDispatch();
  const FriendRequests= useSelector(selectFriendRequest);
  const [loading, setLoading]= useState(false);
  const [error, setError]= useState<string>("");
  // request sent
  const [sentInvitations, setSentInvitations] = useState<FriendRequest[]>(FriendRequests.invitations ||[]);
  // request received
  const [receivedInvitations, setReceivedInvitations] = useState<FriendRequest[]>(FriendRequests.proposals||[]);
  useEffect(()=>{
    dispatch(getAllRequest(currentUser.id));
    setSentInvitations(FriendRequests.invitations);
    setReceivedInvitations(FriendRequests.proposals);

  },[])
  const handleWithdraw = async(invitation: RequestType) => {
    try{  
      setSentInvitations(sentInvitations.filter(item=>item.id!=invitation.id));
      await deleteInvitation({userId:currentUser.id,friendId: invitation.id}, setError, setLoading)
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
      
    }
  };

  const handleAccept = async(invitation: RequestType) => {
    try{
      setReceivedInvitations(receivedInvitations.filter(item=>item.id!=invitation.id));
      await acceptInvitation({userId:invitation.id,friendId:currentUser.id},  setError, setLoading)

    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      toast.success("succesfully ")
    }
  };

  const handleReject = async(invitation: RequestType) => {
     try{
      setReceivedInvitations(receivedInvitations.filter(item=>item.id!=invitation.id));
      await deleteInvitation({userId:invitation.id,friendId: currentUser.id}, setError, setLoading)

    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      toast.success("you reject this invitation")
    }
  };
  return (
    <>
    {openInviteForm? <InvitationForm setOpenInviteForm={setOpenInviteForm}/> : null}
    <div className="bg-gray-100 p-4 h-full overflow-scroll sm:p-6 md:p-8 ">
      <div className="max-w-full">
        {/* Invitation Sent Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500 flex items-center">
            Invitation Sent
            
              <Tooltip>
                <TooltipTrigger>
                  <div
                  onClick={()=>setOpenInviteForm(true)}
                  className='ml-2 flex items-center justify-center border-3 border-black rounded-full w-fit h-fit p-1'>
                    <UserPlus height={20} width={20}/>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>make a friend</p>
                </TooltipContent>
              </Tooltip>
          
          </h2>
          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 sm:gap-6">
            {sentInvitations.length > 0 ? (
              sentInvitations.map(card => (
                <InvitationCard
                  key={card.id}
                  card={card}
                  type="sent"
                  onWithdraw={handleWithdraw}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No sent invitations</p>
            )}
          </div>
        </div>

        {/* Invitation Received Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500">
            Invitation Received
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {receivedInvitations.length > 0 ? (
              receivedInvitations.map(card => (
                <InvitationCard
                  key={card.id}
                  card={card}
                  type="received"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No received invitations</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Invitations;
