import { api } from "../axios";

export const getAllChat = async (
  senderId: number,
  receiverId: number,
  setError?: (error: any) => void,
  setLoading?: (loading: boolean) => void
) => {
  try {
    setLoading?.(true);
    const res = await api.get(`/api/chat/all?senderId=${senderId}&receiverId=${receiverId}`);
    setLoading?.(false);
    return res.data.chatBlocks;
  } catch (e: any) {
    setLoading?.(false);
    setError?.(e.response?.data?.message || e.message || 'An error occurred');
    throw e;
  }
};

export const createChat = async (
  data: { content: string; file?: string; senderId: string; receiverId: string },
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    const res = await api.post('/api/chat/create', data);
    setLoading(false);
    return res.data;
  } catch (e: any) {
    setLoading(false);
    setError(e.response?.data?.message || e.message || 'An error occurred');
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

