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
import { selectFriendRequest } from '@/redux/slice/FriendRequestSlice';
import { selectUserInfo } from '@/redux/slice/userSlice';
import type { FriendRequest, GroupRequest, RequestType } from '@/lib/const';
import { acceptInvitation, deleteInvitation, getAllRequest } from '@/lib/services/invitationService';
import socket from '@/lib/socket';
import { useGetSocketData } from '@/hook/reacthook';
import toast from 'react-hot-toast';

const BaseInvitations =(props:any) => {
    const {
        RequestTooltip,// tool tip
        config,//feature of the component
        RequestForm, // sent request form
        handleReject, //reject the request
        handleAccept, //accept the request
        handleWithdraw,//withdraw the request
        sentInvitations,
        receivedInvitations,
    }= props 

  const [openInviteForm, setOpenInviteForm]=useState(false);
    

  
  
  return (
    <>
    {openInviteForm? <RequestForm setOpenInviteForm={setOpenInviteForm}/> : null}
    <div className="bg-gray-100 p-4 h-full overflow-scroll sm:p-6 md:p-8 ">
      <div className="max-w-full">
        {/* Sent Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500 flex items-center">
            {config.sentLabel}
            <RequestTooltip setOpenInviteForm={setOpenInviteForm}/>    
        
          </h2>
          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 sm:gap-6">
            {sentInvitations.length > 0 ? (
              sentInvitations.map((item:any) => (
                <InvitationCard
                  key={item.id}
                  card={item}
                  type="sent"
                  onWithdraw={handleWithdraw}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No sent request</p>
            )}
          </div>
        </div>

        {/* Received Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500">
            Request Received
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {receivedInvitations.length > 0 ? (
              receivedInvitations.map((item:any) => (
                <InvitationCard
                  key={item.id}
                  card={item}
                  type="received"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            ) : (
              <p className="text-gray-500 text-lg py-8">No received request</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BaseInvitations;
