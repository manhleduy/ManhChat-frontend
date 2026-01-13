import { setErrorMap } from "zod/v3";
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
        const {birthday, name, email, password, phonenumber, address}= data;
        const normalizeDate:string= birthday?.getFullYear()+"-"+(birthday?.getMonth()||-1)+1+"-"+birthday?.getDate();
        setLoading(true); 
        const res = await api.post('/api/user/signup', {
            name: name,
            email: email,
            profilePic:"",
            password: password,
            phonenumber: phonenumber,
            address: address,
            birthday: normalizeDate
        });
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
export const deleteUser= async(setError:any, setLoading:any, id: number)=>{
    try{
        setLoading(true);
        const res= await api.delete(`/api/user/${id}`);
        setLoading(false);

    }catch(e:any){
        console.log(e);
        setLoading(false);
        setError(e.message);
    }
}

export const getUserInfo = async (
    id: number,
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
    id: number,
    data: Partial<UserDefaultInfo>,
    setError: any,
    setLoading: any
) => {
    try {
        const {birthday, name, phonenumber, address}= data;
        if(!birthday){
            return;
        }
        const normalizeDate:string= birthday.getFullYear()+"-"+ (birthday.getMonth()+1)+"-"+birthday.getDate();
        setLoading(true);
        const res = await api.put(`/api/user/updateInfo/${id}`, {birthday:normalizeDate, name, phonenumber, address});
        setLoading(false);
        return res.data;
    } catch (e: any) {
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateUserPassword = async (
    email: string,
    password: string,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.put(`/api/user/updatePassword`, { password, email });
        setLoading(false);
        return res.data;
    } catch (e: any) {
        console.log(e)
        setLoading(false);
        setError(e.response?.data?.message || e.message || 'An error occurred');
    }
};

export const updateUserProfilePic = async (
    id: number,
    avatar: any,
    setError: any,
    setLoading: any
) => {
    try {
        setLoading(true);
        const res = await api.put(`/api/user/updateAvatar/${id}`,{avatar:avatar});
        console.log(avatar.name);
        setLoading(false);
    } catch (e: any) {
        setLoading(false);
        console.log(e);
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
        const res= await api.post("/api/user/findusers", data);
        setLoading(false);
        setError("");
        return res.data.users;
    }catch(e:any){
        console.log(e);
        setError(e.message);
    }
}
export const sendOTP=async(email: string, setError:(error:string)=>void, setLoading:(loading:boolean)=>void)=>{
    try{
        setLoading(false);
        const response= await api.post("/api/user/otp", {email:email})
        setLoading(true);
        return response.data;
    }catch(e:any){
        setLoading(false);
        console.log(e);
        setError(e.message)
    }
}
export const verifyOTP= async(
    otp: number,
    setError:(error: string)=>void, 
    setLoading:(loading:boolean)=>void)=>{
        try{
            setLoading(false);
            const response= await api.post("/api/user/otp/verify", {otp:otp})
            setLoading(true)
            return response
        }
        catch(e:any){
            setLoading(false);
            console.log(e);
            setError(e.message)
        }

}
