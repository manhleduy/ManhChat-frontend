import { api } from "./axios";
import { triggerError, removeError } from "@/redux/ErrorSlice";
import { StartLoading, StopLoading} from "@/redux/LoadingSlice";
import { getUser } from "@/redux/userSlice";
import type { ResponseError } from "@/redux/ErrorSlice";

import type { UserDefaultInfo, UserLoginInfo, UserSignUpInfo } from "./const";
export const Login=async(LoginInfo: UserLoginInfo)=>{
    try{
        removeError();
        const response= await api.post("/auth/login",LoginInfo);
        StartLoading();
        getUser(response.data);
        return "login successfully"
    }catch(error: any){
        const errorObject: ResponseError={
            errorStatus: error.response.status,
            message: error.response.data
        }
        triggerError(errorObject);
    }finally{
        removeError();
        StopLoading();
    }
}
export const SignUp= async(SignUpData: UserSignUpInfo)=>{
    try{
        removeError();
        await api.post("/auth/signup",SignUpData);
        StartLoading();
        return "register successfully, navigate to the sign in page to login your new account";
    }catch(error: any){
        const errorObject: ResponseError={
            errorStatus: error.response.status,
            message: error.response.data
        }
        triggerError(errorObject);
    }finally{
        removeError();
        StopLoading();
    }
}
export const SignOut= async()=>{
    try{
        removeError();
        await api.get("/auth/signout");
        StartLoading();
        return "you have log out yout account"
    }catch(error: any){
        const errorObject: ResponseError={
            errorStatus: error.response.status,
            message: error.response.data
        }
        triggerError(errorObject);
    }finally{
        removeError();
        StopLoading();
    }
}
export const updateUserInfo=async(changedData: UserDefaultInfo)=>{
    try{
        removeError();
        await api.put("/auth");
        StartLoading();
        return "you have log out yout account"
    }catch(error: any){
        const errorObject: ResponseError={
            errorStatus: error.response.status,
            message: error.response.data
        }
        triggerError(errorObject); 
    }finally{
        removeError();
        StopLoading();
    }
}
