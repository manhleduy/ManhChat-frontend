import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FriendBlockInfo, UserDefaultInfo } from "@/lib/const";
import { getFriendList } from "@/lib/services/friendService";
const initialState: {
  friendList:FriendBlockInfo[],
  error:any, 
  status:string}= {
    friendList:[],
    error:"",
    status:"completed"
  }
export const friendListSlice=createSlice({
    name:"friendList",
    initialState,
    reducers:{
      
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getFriendList,{
        fulfilled:(state,action)=>{
          state.error="",
          state.friendList= action.payload,
          state.status="completed"
        },
         pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error"
          state.friendList=[]
          state.status="failed"
        }
      })
    },
    selectors:{
      selectFriendList: (state)=>state
      
    }

})
export const {} = friendListSlice.actions;
export const {selectFriendList}= friendListSlice.selectors;
export default friendListSlice.reducer
