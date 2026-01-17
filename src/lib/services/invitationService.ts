import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../axios";
import { createUserConnect } from "./userService";
import { createGroupConnect } from "./groupService";
import { MakeRequest } from "./services";


export const acceptInvitation= async(
    data: { userId: number; friendId: number },
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try {
        setLoading(true);
        await MakeRequest(`/api/invitation/${data.userId}`, "delete", setError, setLoading, {friendId:data.friendId, usesrId: data.userId})
        await createUserConnect(data.userId, data.friendId, setError, setLoading);
        setLoading(false);
        setError("");
        
    } catch (e: any) { 
        console.log(e);
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
        await MakeRequest(`/api/invitation/group/${memberId}`, "delete", setError, setLoading, {adminId:adminId, groupId:groupId, memberId: memberId})
        await createGroupConnect({memberId:memberId, adminId:adminId,groupId:groupId},setError,setLoading)
        setLoading(false);
        setError("");
    } catch (e: any) { 
        console.log(e);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
}
