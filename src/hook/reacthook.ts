import type { ChatBlockInfo, FriendChatBlock, GroupChatBlock, UserDefaultInfo } from "@/lib/const";
import { useState, useEffect } from "react";

export const useGetMessage=(socket:any, currentUser: UserDefaultInfo)=>{
    const [message, setMessage]= useState<FriendChatBlock>();
    const [groupMessage, setGroupMessage]= useState<GroupChatBlock>();
     useEffect(()=>{
            if(currentUser && currentUser.id){
                socket.on("receiveMessage", (data:any)=>{
                    setMessage(data);
                })
                socket.on("receiveGroupMessage", (data:any)=>{
                    setGroupMessage(data);
                })
            }else{
                return ;
            }
            return ()=>{
                socket.off("receiveMessage");
                socket.off("receiveGroupMessage");
            }
        }, [socket, currentUser.id]);
    return {message, groupMessage}
    
}

export const useUserOnline= (socket:any, currentUser: UserDefaultInfo)=>{
    const [onlineUsers, setOnlineUsers]= useState<number>(0);
    useEffect(()=>{
        if(currentUser && currentUser.id){
            socket.on("getOnlineUsers", (data: number)=>{
                setOnlineUsers(data);
            })
        }
        return ()=>{
            socket.off("getOnlineUsers");
        }
    },[])
    return onlineUsers;
}
export const useUserOffline= (socket:any, currentUser: UserDefaultInfo)=>{
    const [offlineUsers, setOfflineUsers]= useState<number>(0);
    useEffect(()=>{
    
            socket.on("getOfflineUsers", (data: number)=>{
                
                setOfflineUsers(data);
            })
        
        return ()=>{
            socket.off("getOfflineUsers");
        }
    },[])
    return offlineUsers;

}