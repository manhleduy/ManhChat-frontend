import { useEffect, useState } from 'react';
import type { GroupRequest, RequestType } from '@/lib/const';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { acceptGroupRequest} from '@/lib/services/invitationService';
import GroupRequestForm from './GroupRequestForm';
import socket from '@/lib/socket';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFetch, useListenSocket } from '@/hook/reacthook';
import { UserPlus } from 'lucide-react';
import { MakeRequest } from '@/lib/services/services';

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
    const [Error, setError]= useState<string>("")//private
    const [Loading, setLoading]= useState<boolean>(false);//private
    const [sentRequests, setSentRequests] = useState<GroupRequest[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<GroupRequest[]>([]);
    //SOCKET: get new group proposal
    useListenSocket(
      socket,
      currentUser,
      "receiveGroupRequest",
      (data: GroupRequest)=>{
        if(data && data.id===currentUser.id){
          setReceivedRequests(prev=>[...prev, data])
        }
      })
    
    //SOCKET: reject new group proposal
    useListenSocket(
      socket,
      currentUser,
      "rejectGroupRequest",
      (data: {senderId:number, receiverId:number})=>{
        if(data && data.receiverId===currentUser.id){
          setReceivedRequests(prev=>prev.filter(item=>item.id!==data.senderId))
        }
      }
    )
    const {error, loading, data}= useFetch<GroupRequestType>(`/api/invitation/group/${currentUser.id}`, "get", defaultGroupRequest)
    console.log(data)
    useEffect(()=>{
      setSentRequests(data.sentRequests||[]);//public
      setReceivedRequests(data.receivedRequests||[]);//public
    },[data])
  
  const handleWithdraw = async(invitation: any) => {
    try{
      const {id, adminId, groupId}= invitation;
      setSentRequests(sentRequests.filter(item=>item.id!=invitation.id));
      await MakeRequest(`/api/invitation/group/${id}`, "delete", setError, setLoading, {memberId: id, adminId:adminId, groupId:groupId})
      
    }
    catch(e:any){
      console.log(e);
      toast.error(e.message);
    }

  };//private
  const handleAccept =async (invitation: any) => {
    try{
      const {id, adminId, groupId}= invitation;
      setReceivedRequests(receivedRequests.filter(item=>item.id!=invitation.id));
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
      
      setReceivedRequests(receivedRequests.filter(item=>item.id!=invitation.id));
      await MakeRequest(`/api/invitation/group/${id}`, "delete", setError, setLoading, {memberId: id, adminId:adminId, groupId:groupId})
      
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
        sentInvitations={sentRequests}
        receivedInvitations={receivedRequests}
        config={config}
        RequestTooltip={RequestTooltip}
        RequestForm={GroupRequestForm}
        {...props}
      />
    )
  }
  
  
};
