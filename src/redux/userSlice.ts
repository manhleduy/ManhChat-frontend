import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDefaultInfo } from "@/lib/const";
import { Login } from "@/lib/services/userService";
const initialState: {status:string, info:UserDefaultInfo, error: any}={
  status: "",
  info:{  
    id: -1,
    name: "",
    address:"",
    email: "",
    profilePic: "",
    phonenumber: "",
    birthday:""
  },
  error:""

}
export const usersSlice=createSlice({
    name:"users",
    initialState,
    reducers:{
      updateUserInfo:(state, action: PayloadAction<UserDefaultInfo>)=>{
        state.info= action.payload;
      },
      logout: (state)=>{
        return initialState;
      }
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(Login,{
        fulfilled:(state,action)=>{
          state.error="",
          state.info= action.payload,
          state.status='completed'
        },
        pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error"
          state.info= {  
            id: -1,
            name: "",
            address:"",
            email: "",
            profilePic: "",
            phonenumber: "",
            birthday:""
          }
          state.status="failed"
        }
      })
    
    },
    selectors:{
      selectUserInfo:(state)=>state
    },
    
})
export const {updateUserInfo, logout} = usersSlice.actions;
export const {selectUserInfo}= usersSlice.selectors
export default usersSlice.reducer
