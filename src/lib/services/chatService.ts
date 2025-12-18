import { set } from "zod";
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
export const recallChat = async (
  data: { userId: number; chatblockId: number},
  setResponse: any,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.delete(`/api/chat/recall/${data.userId}`, { data });
    setResponse({
      message: res.data,
      status: res.status,
    })
    setLoading(false)
    
  } catch (e: any) {
    setLoading(false);
    setResponse({
      message:e.response?.data?.message || e.message || 'An error occurred',
      status:e.response?.status || 500
  });
  }
};

export const likeChat = async (
  chatblockId: number,
  setResponse: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.put(`/api/chat/like/${chatblockId}`);
    setResponse({
      message: res.data,
      status: res.status,
    })
    setLoading(false);
    
  } catch (e: any) {
    setLoading(false);
    setResponse({
      status:e.response?.status || 500,
      message:e.response?.data?.message || e.message || 'An error occurred'
  });
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

