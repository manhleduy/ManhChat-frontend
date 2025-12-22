import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../axios";

export const sendInvitation = async (
    data: { receiverId: string; content: string; senderId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        await api.post(`/api/invitation/create/${data.senderId}`, data);
        setLoading(false);
        
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

/*export const getAllRequest = async (
    id: number,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/invitation/${id}`);
        setLoading(false);
        return res.data.invitations;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};*/
export const getAllRequest= createAsyncThunk(
    "invitation/friendRequest",
    async (id:number, {rejectWithValue})=>{
        try{
            const res= await api.get(`/api/invitation/${id}`)
            return res.data;
        }catch(e:any){
            console.log(e);
            rejectWithValue(e.response.data);
        }
    }
    )

export const sendGroupRequest = async (
    data: { userId: string; adminId: string; content: string; groupId: string },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        await api.post(`/api/invitation/group/create/${data.adminId}`, data);
        setLoading(false);
        
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};



/*export const getAllGroupRequest = async (
    id: number,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/invitation/group/${id}`);
        setLoading(false);
        return res.data
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};*/

export const getAllGroupRequest= createAsyncThunk(
    "invitation/groupRequest",
    async (id: number, {rejectWithValue})=>{
        try{
            const res= await api.get(`/api/invitation/group/${id}`)
            return res.data;
        }catch(e:any){
            console.log(e);
            rejectWithValue(e.response.data);
        }
    }
)

export const deleteInvitation = async (
    id: string,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const res = await api.delete(`/api/invitation/${id}`);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};