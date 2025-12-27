import { api } from "../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getFriendList=createAsyncThunk(
    "user/fetchFriend",
    async (userId:number, {rejectWithValue})=>{
        try{
            const res=await api.get(`api/user/friend/${userId}`)
            console.log(res.data.friendList)
            return res.data.friendList;
        }catch(e:any){
            console.log(e);
            rejectWithValue(e.response.data)
        }
    }
)
