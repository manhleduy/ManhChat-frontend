import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { FriendRequest, RequestType } from '@/lib/const';
import { AVATAR_GRADIENT } from '@/lib/const';

type InvitationType = 'sent' | 'received';

interface InvitationCardProps {
  card:  RequestType;
  type: InvitationType;
  onWithdraw?: (id: number) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  card,
  type,
  onWithdraw,
  onAccept,
  onReject,
}) => {
  
  return (
    <div className="relative w-full  bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Chat Icon */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
        <button className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
          <MessageCircle size={18} className="text-green-600 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Card Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 pr-10">
        <div
          className="w-12 h-12 sm:w-15 sm:h-15 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold shrink-0"
          style={{ background: AVATAR_GRADIENT[Math.floor(Math.random() * AVATAR_GRADIENT.length)]}}
        >
          {card.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {card.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{card.createdAt.slice(0, 10)}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 sm:mb-5 p-2 sm:p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
          {card.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3">
        {type === 'sent' ? (
          <button
            onClick={() => onWithdraw?.(card.id)}
            className="flex-1 py-2 sm:py-3 px-3 sm:px-5 bg-orange-500 text-white text-xs sm:text-base rounded-lg font-semibold hover:bg-orange-600 transition-colors hover:-translate-y-0.5 truncate"
          >
            Withdraw
          </button>
        ) : (
          <>
            <button
              onClick={() => onAccept?.(card.id)}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-5 bg-green-500 text-white text-xs sm:text-base rounded-lg font-semibold hover:bg-green-600 transition-colors hover:-translate-y-0.5 truncate"
            >
              Accept
            </button>
            <button
              onClick={() => onReject?.(card.id)}
              className="flex-1 py-2 sm:py-3 px-3 sm:px-5 bg-red-500 text-white text-xs sm:text-base rounded-lg font-semibold hover:bg-red-600 transition-colors hover:-translate-y-0.5 truncate"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InvitationCard;
