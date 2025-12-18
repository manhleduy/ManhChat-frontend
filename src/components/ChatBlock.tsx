import type { ChatBlockInfo, UserDefaultInfo } from '@/lib/const';
import { useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/userSlice';
import { Share, TrashIcon } from 'lucide-react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { likeChat, recallChat } from '@/lib/services/chatService';
import { set } from 'zod';




const ChatBlock = ({chatBlockInfo, currentChat,setLoading,setResponse}: {chatBlockInfo: ChatBlockInfo, currentChat: UserDefaultInfo,setLoading:any,setResponse:any}) => {
  const { senderId, receiverId, content, createdAt, likeNum, isRead, id } = chatBlockInfo;
  const {profilePic, name }= currentChat;
  
  const DeleteMessage=async()=>{
    try{
     await recallChat({chatblockId:id||0, userId:currentUser.id},setResponse,setLoading );
  
    } catch(e:any){
      toast.error(e.message);
    } finally{
      toast.success("Message Deleted")
    }
  }
  const LikeMessage= async()=>{
    try{
      await likeChat(id||0, setResponse, setLoading)
    }catch(e:any){
      toast.error(e.message);
    }finally{
    
    }
  }

  const currentUser = useAppSelector(selectUserInfo).info;

  if(senderId===currentUser.id)return (
    <div className="flex justify-end">
      
      <div className={`flex relative  gap-2 items-end ${isRead ? 'flex-row-reverse' : 'flex-row'}`}>
        <button
         onClick={()=>{
          LikeMessage();
         }}
        className='flex absolute right-0 bottom-0 m-1 '>
          <Heart height={15} width={15} fill="red"/>
          <div>{likeNum}</div>
        </button>
        <DropdownMenu modal={false}>
        <DropdownMenuTrigger >
          ...
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={()=>{
              DeleteMessage();
            }}>
              <div className='flex'>
                <div>Delete</div>
                <TrashIcon height={20}  width={20}/>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button className='flex'>
                <div>Share</div>
                <Share height={20}  width={20}/>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
        <div
          className={`flex flex-col max-w-xs ${isRead ? 'items-end' : 'items-start'} animate-[slideIn_0.3s_ease-out]`}
        >
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-sm font-semibold text-green-600">{currentUser.name}</span>
            
          </div>
          <div
            className="px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word bg-blue-500 text-white rounded-br-sm"
          >
            {content}
          </div>
          <span className="text-xs text-gray-400">{createdAt?.slice(0,10)}</span>
        </div>

        <button
          className="opacity-0 hover:opacity-100 transition-opacity duration-200 shrink-0"
          aria-label="Message options"
        >
          
        </button>
      </div>
    </div>
  )
  return (
    <div className="flex justify-start">
      <div className={`flex gap-2 items-end ${isRead ? 'flex-row-reverse' : 'flex-row'}`}>
        <button
         onClick={()=>{
          LikeMessage();
         }}
         className='flex absolute right-0 bottom-0 m-1 '>
          <Heart height={15} width={15} fill="red"/>
          <div>{likeNum}</div>
        </button>
        <div
          className={`flex flex-col max-w-xs ${isRead ? 'items-end' : 'items-start'} animate-[slideIn_0.3s_ease-out]`}
        >
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-sm font-semibold text-green-600">{name}</span>
            
          </div>
          <div
            className="px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word bg-gray-100 text-gray-800 rounded-bl-sm"
          >
            {content}
          </div>
          <span className="text-xs text-gray-400">{createdAt?.slice(0,10)}</span>
        </div>
        
        <button
          className="opacity-0 hover:opacity-100 transition-opacity duration-200 shrink-0"
          aria-label="Message options"
        >
        </button>
      </div>
    </div>
  );
};

export default ChatBlock;
