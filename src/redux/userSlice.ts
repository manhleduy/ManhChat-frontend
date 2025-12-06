import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { UserDefaultInfo } from "@/lib/const";

const initialState: UserDefaultInfo={
    id: "",
    name: "",
    address:"",
    email: "",
    profilePic: "",
    phonenumber: "",
    birthday:""
}
export const usersSlice=createSlice({
    name:"users",
    initialState,
    reducers:{
      getUser:(state,action: PayloadAction<UserDefaultInfo>)=>{
        return action.payload
      },      
    }
})
export const {getUser} = usersSlice.actions;
export const currentUsers= (state:RootState)=>state.users;
export default usersSlice.reducer
