import { useEffect, useState } from 'react';
import InvitationCard from './InvitationCard';
import type { GroupRequest, RequestType } from '@/lib/const';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { acceptGroupRequest, deleteGroupRequest, getAllGroupRequest } from '@/lib/services/invitationService';
import GroupRequestForm from './GroupRequestForm';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFetch } from '@/hook/reacthook';
import { UserPlus } from 'lucide-react';

//tool tip
type GroupRequestType={
  receivedRequests:GroupRequest[],
  sentRequests:GroupRequest[]
}
const defaultGroupRequest={
  receivedRequests:[],
  sentRequests:[]
}
export const GroupInvitation = (WrappedComponent:any) => {
  const RequestTooltip=(props: any)=>{
    const {setOpenInviteForm}= props;
    return (
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
    )
}
//config
const config={
    sentLabel:"Group Invitation Sent",
    receivedLabel:"Group Invitation Received"
  }
  return function EnhancedComponent(props:any){
    
    const currentUser= useSelector(selectUserInfo).info;//private
    const {error, loading, data}= useFetch<GroupRequestType>(`/api/invitation/group/${currentUser.id}`, "get", defaultGroupRequest)
    const [Error, setError]= useState<string>("")//private
    const [Loading, setLoading]= useState<boolean>(false);//private
    const [sentInvitations, setSentInvitations] = useState<GroupRequest[]>(data.sentRequests||[]);
    const [receivedInvitations, setReceivedInvitations] = useState<GroupRequest[]>(data.receivedRequests||[]);

  useEffect(()=>{
    setSentInvitations(data.sentRequests||[]);//public
    setReceivedInvitations(data.receivedRequests||[]);//public
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

  };//private
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
  };//private
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
  };//private
    return(
      <WrappedComponent
        handleReject={handleReject}
        handleAccept={handleAccept}
        handleWithdraw={handleWithdraw}
        sentInvitations={sentInvitations}
        receivedInvitations={receivedInvitations}
        config={config}
        RequestTooltip={RequestTooltip}
        RequestForm={GroupRequestForm}
        {...props}
      />
    )
  }
  
  
};
