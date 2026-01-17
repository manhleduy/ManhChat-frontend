import type { ChatBlockInfo, FriendChatBlock, GroupChatBlock, GroupDefaultInfo, socketEventType, UserDefaultInfo } from "@/lib/const";

import { useState, useEffect, use } from "react";
import { api } from "@/lib/axios";
import { current } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


export const useGetSocketData=<T>(socket: any, currentUser: UserDefaultInfo, emitEvent: socketEventType)=>{
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
export const useListenSocket= <T>(
    socket: any, 
    currentUser: UserDefaultInfo, 
    emitEvent: socketEventType,
    callback: (data: T)=>void,
    notification?: string,
)=>{
    
    useEffect(()=>{
        socket.on(emitEvent, (data: T)=>{ 
            callback(data);
            if(notification){
                toast(notification);
            }
        })
    return ()=>{
        socket.off(emitEvent)
    }
    },[socket, currentUser.id])   
}

export const useDebounce = <T>(value: T, delay: number): T => {
    const [debounce, set]= useState<T>(value)
    useEffect(()=>{
        const t= setTimeout(()=>{set(value)}, delay)
        return ()=>clearTimeout(t);
    },[value, delay])
    return debounce
}

export const useFetch=<T>(url: string, type: "get"|"post", defaultInfo: T, body?: any)=>{
    const [error, setError]= useState<string>("");
    const [loading, setLoading]= useState<boolean>(false);
    const [data, setData]= useState<T>(defaultInfo);
    useEffect(()=>{
        const sendRequest= async()=>{
            try{
                setLoading(true);
                if(type==="get"){
                    const response= await api.get(url);
                    setData(response.data);
                }else if(type==="post"){
                    const response= await api.post(url, body);
                    setData(response.data);
                }else{
                    setError("Your request type are not allow to fetch data from database"),
                    setData(defaultInfo),
                    setLoading(false);                   
                }
            }catch(e:any){
                setError(e.data);
                setLoading(false);
                setData(defaultInfo);
            }finally{
                setLoading(false);
                setError("");
            }

        }
        sendRequest();
    },[])
    return {error, loading, data};
}



export const SocketNotification=async<T>(socket: any, currentUser: UserDefaultInfo, emitEvent: socketEventType, notification: string)=>{
    
  const data= useGetSocketData<T>(socket, currentUser, emitEvent);
   useEffect(()=>{
    if(data){
        toast(notification,{
            icon:'💬',
        })
    }
   },[data])
}