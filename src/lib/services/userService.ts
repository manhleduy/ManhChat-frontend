import { api } from "../axios";

import type { UserDefaultInfo, UserLoginInfo, UserSignUpInfo } from "../const";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const Login = createAsyncThunk(
    'users/fetchUser',
    async (LoginInfo: UserLoginInfo, { rejectWithValue }) => {
        try {
            const res = await api.post("/api/user/login", LoginInfo);
            return res.data.userInfo;
        } catch (e: any) {
            console.log(e);
            return rejectWithValue(e.response?.data?.message || e.message || 'An error occurred');
        }
    }
);

export const signUp = async (
    data: UserSignUpInfo,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.post('/api/user/signup', data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const logout = async (setError: any,setLoading: any) => {
    try {
        setLoading(true);
        const res = await api.get('/api/user/logout');
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getUserInfo = async (
    id: string,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/user/${id}`);
        setLoading(false);
        return res.data.userInfo;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getAllGroup = async (
    id: string,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.get(`/api/user/group/${id}`);
        setLoading(false);
        return res.data.groupList;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateUserInfo = async (
    id: string,
    data: Partial<UserDefaultInfo>,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.put(`/api/user/updateInfo/${id}`, data);
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateUserPassword = async (
    id: string,
    password: string,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.put(`/api/user/updatePassword/${id}`, { password });
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateUserAvatar = async (
    id: string,
    avatar: string,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.put(`/api/user/updateAvatar/${id}`, { avatar });
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const createUserConnect = async (
    userId: number,
    friendId: number,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.post(`/api/user/createconnect/${userId}`, { userId, friendId, isvalid: true });
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const getUserInvitation= async(
    data:{name: string, email?:string, phonenumber?:string},
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try{
        setLoading(true);
        const res= await api.post("/api/user/invitation", data);
        setLoading(false);
        return res.data
    }catch(e:any){
        console.log(e);
        setError(e.message);
    }
}
export const findUsers=async(
    data:{name: string, email:string, phonenumber:string},
    setError:(error:string)=>void,
    setLoading:(loading:boolean)=>void
)=>{
    try{
        setLoading(true);
        const res= await api.post("/api/user/getusers", data);
        setLoading(false);
        setError("");
        return res.data.users;
    }catch(e:any){
        console.log(e);
        setError(e.message);
    }
}