import type { ChatBlockInfo, FriendChatBlock, GroupChatBlock, GroupDefaultInfo, UserDefaultInfo } from "@/lib/const";

import { useState, useEffect } from "react";


export const useGetSocketData=<T>(socket: any, currentUser: UserDefaultInfo, emitEvent: string)=>{
    const [socketData, setSocketData]= useState<T>();
    
    useEffect(()=>{
            socket.on(emitEvent, (data: T)=>{
                setSocketData(data);
            })
        return ()=>{
            socket.off(emitEvent);
        }
    },[socket, currentUser.id])
    return socketData;
}   

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debounce, set]= useState<T>(value)
    useEffect(()=>{
        const t= setTimeout(()=>{set(value)}, delay)
        return ()=>clearTimeout(t);
    },[value, delay])
    return debounce
}
