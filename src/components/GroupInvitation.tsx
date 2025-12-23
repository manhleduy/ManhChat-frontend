import { useEffect, useState } from 'react';
import InvitationCard from './InvitationCard';
import type { GroupRequest, RequestType } from '@/lib/const';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectUserInfo } from '@/redux/userSlice';
import { selectGroupRequest } from '@/redux/GroupRequestSlice';
import { acceptGroupRequest, deleteGroupRequest, getAllGroupRequest } from '@/lib/services/invitationService';
import GroupRequestForm from './GroupRequestForm';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserPlus } from 'lucide-react';
const GroupInvitation = () => {
  const dispatch= useAppDispatch();
  const currentUser= useSelector(selectUserInfo).info;
  const GroupRequests= useSelector(selectGroupRequest);
  const [error, setError]= useState<string>("")
  const [loading, setLoading]= useState<boolean>(false);
  const [openInviteForm, setOpenInviteForm]=useState(false);
  const [sentInvitations, setSentInvitations] = useState<GroupRequest[]>(GroupRequests.proposals||[]);
  const [receivedInvitations, setReceivedInvitations] = useState<GroupRequest[]>(GroupRequests.invitations||[]);

  useEffect(()=>{
    dispatch(getAllGroupRequest(currentUser.id));
    setSentInvitations(GroupRequests.proposals);
    setReceivedInvitations(GroupRequests.invitations);
  },[])
  const handleWithdraw = async(invitation: any) => {
    try{
      const {id, adminId, groupId}= invitation;
      setSentInvitations(sentInvitations.filter(item=>item.id!=invitation.id));
      await deleteGroupRequest({memberId: id, adminId:adminId, groupId:groupId}, setError,setLoading)
    }
    catch(e:any){
      console.log(e);
      toast.error(e.message);
    }

  };
  const handleAccept =async (invitation: any) => {
    try{
      const {id, adminId, groupId}= invitation;
      setSentInvitations(sentInvitations.filter(item=>item.id!=invitation.id));
      await acceptGroupRequest({memberId: id, adminId: adminId, groupId:groupId}, setError, setLoading)
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      toast.success("you accept a new user to your group")
    }
  };
  const handleReject =async (invitation: any) => {
    try{
      const {id, adminId, groupId}= invitation;
      setSentInvitations(sentInvitations.filter(item=>item.id!=invitation.id));
      await deleteGroupRequest({memberId: id, adminId:adminId, groupId:groupId}, setError,setLoading)
      
    }catch(e:any){
      console.log(e);
      toast.error(e.message);
    }finally{
      toast.success("you reject a user")
    }
  };
  return (
    <>
    {openInviteForm? <GroupRequestForm setOpenInviteForm={setOpenInviteForm}/> : null}
    <div className="h-full overflow-scroll bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-full">
        {/* Group Invitation Sent Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500">
            Group Invitations Sent
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sentInvitations.length > 0 ? (
              sentInvitations.map(item => (
                <InvitationCard
                  key={item.id}
                  card={item}
                  type="sent"
                  onWithdraw={handleWithdraw}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No sent group invitations</p>
            )}
          </div>
        </div>

        {/* Group Invitation Received Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500">
            Group Invitations Received
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {receivedInvitations.length > 0 ? (
              receivedInvitations.map(item => (
                <InvitationCard
                  key={item.id}
                  card={item}
                  type="received"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No received group invitations</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default GroupInvitation;