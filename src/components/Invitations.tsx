import { useState } from 'react';
import InvitationCard from './InvitationCard';
import { UserPlus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import InvitationForm from './InvitationForm';
type InvitationCard = {
  id: number;
  name: string;
  initial: string;
  date: string;
  description: string;
  avatarGradient: string;
};

const Invitations =() => {
  const [openInviteForm, setOpenInviteForm]=useState(false);

  const [sentInvitations, setSentInvitations] = useState<InvitationCard[]>([
    {
      id: 1,
      name: 'Jessica Miller',
      initial: 'J',
      date: 'Sent 2 days ago',
      description: 'Software engineer passionate about web development and open source. Love hiking and photography in my free time.',
      avatarGradient: 'linear-gradient(135deg, #2196f3, #64b5f6)',
    },
    {
      id: 2,
      name: 'Michael Chen',
      initial: 'M',
      date: 'Sent 5 days ago',
      description: 'Marketing specialist with 5 years experience. Coffee enthusiast and always up for a good conversation about tech trends.',
      avatarGradient: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
    },
    {
      id: 3,
      name: 'Sarah Thompson',
      initial: 'S',
      date: 'Sent 1 week ago',
      description: 'Graphic designer and illustrator. Creating beautiful things is my passion. Currently working on building my portfolio.',
      avatarGradient: 'linear-gradient(135deg, #ff9800, #ffb74d)',
    },
  ]);

  const [receivedInvitations, setReceivedInvitations] = useState<InvitationCard[]>([
    {
      id: 1,
      name: 'Robert Anderson',
      initial: 'R',
      date: 'Received 1 hour ago',
      description: 'Full-stack developer specializing in React and Node.js. Enjoy building scalable applications and mentoring junior developers.',
      avatarGradient: 'linear-gradient(135deg, #4caf50, #81c784)',
    },
    {
      id: 2,
      name: 'Laura White',
      initial: 'L',
      date: 'Received 3 hours ago',
      description: 'UX/UI designer with a keen eye for detail. Love creating intuitive interfaces that users love. Also a yoga instructor on weekends.',
      avatarGradient: 'linear-gradient(135deg, #f44336, #ef5350)',
    },
    {
      id: 3,
      name: 'Daniel Garcia',
      initial: 'D',
      date: 'Received yesterday',
      description: 'Data scientist and machine learning enthusiast. Currently exploring AI applications in healthcare. Avid reader and chess player.',
      avatarGradient: 'linear-gradient(135deg, #00bcd4, #4dd0e1)',
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      initial: 'E',
      date: 'Received 2 days ago',
      description: 'Content writer and digital marketer. Passionate about storytelling and brand building. Love traveling and discovering new cultures.',
      avatarGradient: 'linear-gradient(135deg, #673ab7, #9575cd)',
    },
  ]);

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
    <>
    {openInviteForm? <InvitationForm setOpenInviteForm={setOpenInviteForm}/> : null}
    <div className="bg-gray-100 p-4 h-full overflow-scroll sm:p-6 md:p-8 ">
      <div className="max-w-full">
        {/* Invitation Sent Section */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 border-b-4 border-green-500 flex items-center">
            Invitation Sent
            <button
             onClick={()=>setOpenInviteForm(true)}
             className='ml-2 flex items-center justify-center border-3 border-black rounded-full w-fit h-fit p-1'>
            <Tooltip>
              <TooltipTrigger>
                <UserPlus height={20} width={20}/>
              </TooltipTrigger>
              <TooltipContent>
                <p>make a friend</p>
              </TooltipContent>
            </Tooltip>
          </button>
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
