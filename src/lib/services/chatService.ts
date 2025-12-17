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

export const likeChat = async (
  chatblockId: string,
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.put(`/api/chat/like/${chatblockId}`);
    setLoading(false);
    return res.data;
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred');
  }
};

export const recallChat = async (
  data: { userId: string; chatblockId: string },
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.delete('/api/chat/recall', { data });
    setLoading(false);
    return res.data;
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred');
  }
};

export const markAsRead = async (
  data: { userId: string; chatblockId: string },
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.put('/api/chat/read', data);
    setLoading(false);
    return res.data;
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred');
  }
};

