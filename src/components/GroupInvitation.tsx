import { useState } from 'react';
import InvitationCard from './InvitationCard';

type GroupInvitationCard = {
  id: number;
  name: string;
  initial: string;
  date: string;
  description: string;
  avatarGradient: string;
};

const GroupInvitation = () => {
  const [sentInvitations, setSentInvitations] = useState<GroupInvitationCard[]>([]);

  const [receivedInvitations, setReceivedInvitations] = useState<GroupInvitationCard[]>([]);

  const handleWithdraw = (id: number) => {
    setSentInvitations(sentInvitations.filter(inv => inv.id !== id));
  };

  const handleAccept = (id: number) => {
    setReceivedInvitations(receivedInvitations.filter(inv => inv.id !== id));
  };

  const handleReject = (id: number) => {
    setReceivedInvitations(receivedInvitations.filter(inv => inv.id !== id));
  };

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
              sentInvitations.map(card => (
                <InvitationCard
                  key={card.id}
                  card={card}
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
              <p className="text-gray-500 text-lg py-8">No received group invitations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInvitation;