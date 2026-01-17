import { useEffect, useState } from 'react';
import InvitationCard from './InvitationCard';
import { UserPlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFetch } from '@/hook/reacthook';
import InvitationForm from './InvitationForm';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '@/redux/slice/userSlice';
import type { FriendRequest, RequestType } from '@/lib/const';
import { acceptInvitation, deleteInvitation} from '@/lib/services/invitationService';
import socket from '@/lib/socket';
import { useGetSocketData } from '@/hook/reacthook';
import toast from 'react-hot-toast';


export const Invitations =(WrappedComponent:any) => {
  const RequestTooltip=(props:any)=>{
    const {setOpenInviteForm}= props;
    return(
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
    sentLable:"Invitation Sent",
    receivedLabel:"Invitation Received"
  }
  type FriendRequestType={
    receivedRequests:FriendRequest[],
    sentRequests:FriendRequest[]
  }
  const defaultFriendRequest={
    receivedRequests:[],
    sentRequests:[]
  }

  return function EnhancedComponent(props:any){
  const currentUser= useSelector(selectUserInfo).info;
  const {error, loading, data}= useFetch<FriendRequestType>(`/api/invitation/${currentUser.id}`, "get", defaultFriendRequest)
  const [Loading, setLoading]= useState(false);
  const [Error, setError]= useState<string>("");
  // request sent
  const [sentInvitations, setSentInvitations] = useState<FriendRequest[]>(data.sentRequests||[]);
  console.log(data.sentRequests, data.receivedRequests);
  // request received
  const [receivedInvitations, setReceivedInvitations] = useState<FriendRequest[]>(data.receivedRequests||[]);
  
  //socket handle
  const newRequest= useGetSocketData<FriendRequest>(socket, currentUser, "receiveFriendRequest");
  useEffect(()=>{
    if(newRequest){
    setSentInvitations(a=>[...a, newRequest]);
    toast.success("get a request ")
    }
  },[newRequest])
  ////
  useEffect(()=>{
    setSentInvitations(data.sentRequests||[]);
    setReceivedInvitations(data.receivedRequests||[]);
  },[data])

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
     <WrappedComponent
        handleReject={handleReject}
        handleAccept={handleAccept}
        handleWithdraw={handleWithdraw}
        sentInvitations={sentInvitations}
        receivedInvitations={receivedInvitations}
        config={config}
        RequestTooltip={RequestTooltip}
        RequestForm={InvitationForm}
        {...props}
      />
  )
}
};


