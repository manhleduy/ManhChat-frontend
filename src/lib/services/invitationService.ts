import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../axios";
import { createUserConnect } from "./userService";
import { createGroupConnect } from "./groupService";

export const sendInvitation = async (
    data: { 
        name:string,
        phonenumber:string;
        email:string
        content: string;
        senderId: number 
    },
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
export const sendGroupRequest = async (
    data: { userId: string; adminId: string; content: string; groupId:number },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        await api.post(`/api/invitation/group/create/${data.userId}`, data);
        setLoading(false);
        
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};
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
    data: { userId: number; friendId: number },
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        await api.delete(`/api/invitation/${data.userId}`,{data});
        
        setLoading(false);
    } catch (e: any) {
    
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};
export const acceptInvitation= async(
    data: { userId: number; friendId: number },
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try {
        setLoading(true);
        await deleteInvitation({userId:data.userId, friendId:data.friendId}, setError, setLoading);
        await createUserConnect(data.userId, data.friendId, setError, setLoading);
        setLoading(false);
        setError("");
        
    } catch (e: any) { 
        console.log(e);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
}
export const deleteGroupRequest= async(
    data: { memberId: number; adminId: number; groupId: number },
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try {
        setLoading(true);
        await api.delete(`/api/invitation/group/${data.memberId}`, {data});
        setLoading(false);   
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
}
export const acceptGroupRequest= async(
    data: { memberId: number; adminId: number; groupId: number},
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try {
        const {memberId, adminId, groupId}= data;
        setLoading(true);
        await deleteGroupRequest({memberId:memberId, adminId:adminId,groupId:groupId},setError,setLoading)
        await createGroupConnect({memberId:memberId, adminId:adminId,groupId:groupId},setError,setLoading)
        setLoading(false);
        setError("");
    } catch (e: any) { 
        console.log(e);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
}
