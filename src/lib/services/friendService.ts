import { api } from "../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getFriendList=createAsyncThunk(
    "user/fetchFriend",
    async (userId:number, {rejectWithValue})=>{
        try{
            const res=await api.get(`api/user/friend/${userId}`)
            return res.data.friendList;
        }catch(e:any){
            console.log(e);
            rejectWithValue(e.response.data)
        }
    }
)

export const unFriend= async(
    data:{userId:number, friendId:number},
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try{
        setLoading(true);
        const res= await api.delete(`/api/friend/${data.userId}`, {data});
        setLoading(false);
        return res.data;
    }catch(e:any){
        console.log(e);
        setError(e.message);
        setLoading(false);
    }
}