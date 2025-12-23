import { data } from "react-router-dom";
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
