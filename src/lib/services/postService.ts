import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../axios";
import type { PostDefaultInfo } from "../const";

export const getAllFriendPost= createAsyncThunk(
    'post/friend',
    async(userId:number, {rejectWithValue})=>{
        try{
            const res= await api.get(`/api/post/friends/${userId}`);
            return res.data.posts;
        }catch(e:any){
            console.log(e);
            return rejectWithValue(e.response?.data?.message || e.message || 'An error occurred');

        }
    }
)
export const getAllPost= createAsyncThunk(
    'post/user',
    async(userId:number, {rejectWithValue})=>{
        try{
            const res= await api.get(`/api/post/${userId}`);
            return res.data.posts;
        }catch(e:any){
            console.log(e);
            return rejectWithValue(e.response?.data?.message || e.message || 'An error occurred');
        }
    }
)
export const deletePost= async(
    data: {userId: number, postId: number},
    setError: (message: string)=>void,
    setLoading: (load: boolean)=>void
)=>{
    try{
        setLoading(true);
        await api.delete(`/api/post/${data.userId}`, {data});
        setLoading(false);
    }catch(e:any){
        console.log(e);
        setError(e.response?.data || e.message || "An error occurred");
    }
}
export const likePost= async(postId: number)=>{
    try{
        await api.put(`/api/post/${postId}`);
    }catch(e:any){
        console.log(e);
    }
}
export const createPost= async(
    data:{ userId:number, content:string, file:string},
    setError: (message: string)=>void,
    setLoading: (load: boolean)=>void
)=>{
    try{
        setLoading(true)
        await api.post(`/api/post/create/${data.userId}`,data )
        setLoading(false);
    }catch(e:any){
        console.log(e);
        setError(e.response?.data || e.message || "An error occured")
    }
}