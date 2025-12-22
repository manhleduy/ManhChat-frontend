
import { api } from "../axios";

export const getAllChat = async (
  senderId: number,
  receiverId: number,
  setError?: (error: any) => void,
  setLoading?: (loading: boolean) => void
) => {
  try {
    setLoading?.(true);
    const res = await api.post(`/api/chat/${senderId}`, {receiverId:receiverId});
    setLoading?.(false);
    return res.data.chatblocks;
  } catch (e: any) {
    setLoading?.(false);
    setError?.(e.response?.data?.message || e.message || 'An error occurred');
    throw e;
  }
};

export const getAllGroupChat=async(groupId:number, userId:number, setError:any, setLoading:any)=>{
  try{
    setLoading(true);
    const res= await api.post(`/api/chat/group/${groupId}`,{memberId:userId});
    setLoading(false);
    return res.data.chatblocks;
  }catch(e:any){
    console.log(e)
    setError(e.response?.data?.message || e.message || 'An error occurred')
  }
}
export const createChat = async (
  data: { content: string; file?: string; senderId: number; receiverId: number },
  setResponse: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.post(`/api/chat/create/${data.senderId}`, data);
    setLoading(false);
    setResponse({
      message: res.data,
      status: res.status,
    })
  } catch (e: any) {
    setLoading(false);
    setResponse({
      message: e.response?.data?.message || e.message || 'An error occurred',
      status: e.response?.status || 500
    });
  } 
};

export const createGroupChat= async(
  data: { content: string; file?: string; senderId: number; groupId: number },
  setResponse: (error:any)=>void,
  setLoading:(loading:boolean)=>void
)=>{
  try{
    setLoading(true);
    const res= await api.post(`/api/chat/group/create/${data.groupId}`, data);
    setLoading(false);
    setResponse({
      message: res.data,
      status: res.status,
    })
  }catch(e:any){
    setLoading(false);
    setResponse({
      message: e.response?.data?.message || e.message ||"An error occurred",
      status: e.response?.status || 500
    })
  }
}

export const recallChat = async (
  data: { userId: number; chatblockId: number},
  setError: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.delete(`/api/chat/recall/${data.userId}`, { data });
    setError(null)
    setLoading(false)
    
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred',);
  }
};
 
export const likeChat = async (
  chatblockId: number,
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    await api.put(`/api/chat/like/${chatblockId}`);
    setError(null)
    setLoading(false);
    
    
  } catch (e: any) {
    setLoading(false);
  
    setError(e.response?.data?.message || e.message || 'An error occurred')

  }
};



export const markAsRead = async (
  data: { userId: number; chatblockId: string },
  setResponse: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.put(`/api/chat/read/${data.chatblockId}`, data);
    setLoading(false);
    setResponse({
      message: res.data,
      status: res.status,
    })
  } catch (e: any) {
    setLoading(false);
    setResponse({
      status:e.response?.status || 500,
      message:e.response?.data?.message || e.message || 'An error occurred'
    });
  }
};
export const recallGroupChat= async()=>{

}
export const likeGroupChat= async()=>{
  
}
