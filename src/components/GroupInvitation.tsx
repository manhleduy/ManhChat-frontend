import { useEffect, useState } from 'react';
import InvitationCard from './InvitationCard';
import type { GroupRequest, RequestType } from '@/lib/const';
import { useAppDispatch } from '@/redux/reduxHook';
import { useSelector } from 'react-redux';

import { selectUserInfo } from '@/redux/userSlice';
import { selectGroupRequest } from '@/redux/GroupRequestSlice';
import { getAllGroupRequest } from '@/lib/services/invitationService';

const GroupInvitation = () => {
  const dispatch= useAppDispatch();
  const currentUser= useSelector(selectUserInfo).info;
  const GroupRequests= useSelector(selectGroupRequest);
  const [sentInvitations, setSentInvitations] = useState<GroupRequest[]>(GroupRequests.proposals||[]);

  const [receivedInvitations, setReceivedInvitations] = useState<GroupRequest[]>(GroupRequests.invitations||[]);

  useEffect(()=>{
    dispatch(getAllGroupRequest(currentUser.id));
    setSentInvitations(GroupRequests.proposals);
    setReceivedInvitations(GroupRequests.invitations);
  },[])
  const handleWithdraw = async(invitation: RequestType) => {
  };

  const handleAccept =async (invitation: RequestType) => {
  };

  const handleReject =async (invitation: RequestType) => {
  };
  console.log(GroupRequests);
  return (
    <div className="h-full overflow-scroll bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-full">
        {/* Group Invitation Sent Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500">
            Group Invitations Sent
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
  );
};

export default GroupInvitation;