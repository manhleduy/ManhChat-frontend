
import { api } from "../axios";


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

export const markAsRead=async(data:{receiverId: number, senderId: number})=>{
  try{
    if(!data) return;
    await api.put(`/api/chat/read`, data);
  }catch(e:any){
    console.log(e);
  }
}


