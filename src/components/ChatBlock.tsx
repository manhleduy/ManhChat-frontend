import type { MessageType} from '@/lib/const';
import { useAppSelector } from '@/redux/reduxHook';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { Share, TrashIcon } from 'lucide-react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState, type JSX, type ReactElement, type ReactNode } from 'react';
import { MakeRequest } from '@/lib/services/services';
//chat drop down 
const SenderDropDown=(props:any)=>{
  const DeleteMessage=props.DeleteMessage;
  return(
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
            <DropdownMenuItem >
              <div className='flex'>
                <div>Share</div>
                <Share height={20}  width={20}/>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Download</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

//base chat block
const BaseChatBlock=(props:any)=>{
  const [error, setError]= useState<string>("")
  const [loading, setLoading]= useState<boolean>(false);
  const { senderId, content, createdAt, likeNum, id, isRead, profilePic, name, file } = props.chatBlockInfo as MessageType;
  
  const {config, dropdown}= props
  //like the message
  const LikeMessage= async()=>{
    try{
      await MakeRequest(`/api/chat/like/${id}`, "put", setError, setLoading)
    }catch(e:any){
      toast.error(e.message);
    }finally{
      
    }
  }
  //delete the message
  const DeleteMessage=async()=>{
      try{
        await MakeRequest(`/api/chat/recall/${currentUser.id}`,"delete",setError,setLoading, {chatblockId:id||0, userId:currentUser.id} );
      } catch(e:any){
        toast.error(e.message);
      } finally{
        toast.success("Message Deleted")
      }
    }
  const currentUser = useAppSelector(selectUserInfo).info;
  return (
    <div className={`flex ${config.justifyPosition}`}>
      <div className={`flex gap-2 items-end`}>
        <button
         onClick={()=>{
          LikeMessage();
         }}
         className='flex absolute right-0 bottom-0 m-1 '>
          <Heart height={15} width={15} fill="red"/>
          <div>{likeNum}</div>
        </button>
        {dropdown?<SenderDropDown DeleteMessage={DeleteMessage}/>:null}

        <div
          className={`flex flex-col max-w-xs  animate-[slideIn_0.3s_ease-out]`}
        >
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-sm font-semibold text-green-600">{name}</span>
            
          </div>
          <div
            style={{background:config.backgroundColor}}
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word ${config.mesageStyle}` }
          >
            {content}
            {file && (
              <div className="mt-2">
                {file.match(/\.(jpeg|jpg|png)$/i) ? (
                  <img src={file} alt="attachment" className="max-w-full h-auto rounded max-h-[100px]" />
                ) : (
                  <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                    Download file
                  </a>
                )}
              </div>
            )}
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
}

//chat block from the sender perspective
const senderChatBlock=(WrappedComponent:(props:any)=>JSX.Element, chatBlockInfo:any)=>{
  return function EnhancedComponent(props:any){
    //config of the sender
    const senderConfig={
      mesageStyle: " bg-blue-500 text-white rounded-br-sm",
      backgroundColor:"blue-500",
      justifyPosition: "justify-end"
    }
    return (
      <WrappedComponent
      dropdown={<SenderDropDown/>}
      chatBlockInfo={chatBlockInfo}
      config={senderConfig}
      />
    )
  }
  
  
}
const receiverChatBlock=(WrappedComponent:(props:any)=>JSX.Element, chatBlockInfo:any)=>{
  return function EnhancedComponent(props:any){
      //config of the receiver
      const receiverConfig={
        messageStyle:" bg-gray-100 text-gray-800 rounded-bl-sm",
        justifyPosition: "justify-start",
        backgroundColor: "gray"
      }
      return (
      <WrappedComponent
      chatBlockInfo={chatBlockInfo}
      config={receiverConfig}
      />
    )
      
  }
}

const ChatBlock = ({chatBlockInfo}:any) => {
  

  
  
  const { senderId} = chatBlockInfo as MessageType;
  
  const currentUser = useAppSelector(selectUserInfo).info;

  if(senderId===currentUser.id){
   
    const SenderChatComponent=senderChatBlock(BaseChatBlock, chatBlockInfo)
    return <SenderChatComponent/>
  }
  const ReceiverChatComponent= receiverChatBlock(BaseChatBlock, chatBlockInfo)
  return <ReceiverChatComponent/>

};

export default ChatBlock;
