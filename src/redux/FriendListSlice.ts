import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { UserDefaultInfo } from "@/lib/const";
const initialState: UserDefaultInfo[]= []
export const friendListSlice=createSlice({
    name:"error",
    initialState,
    reducers:{
      getFriendList:(state,action: PayloadAction<string>)=>{
        return initialState
      },
      addFriend:(state, action: PayloadAction<UserDefaultInfo>)=>{
        
      },
      removeFriend:(state, action: PayloadAction<string>)=>{
        
      },
    }
})
export const {getFriendList,addFriend, removeFriend} = friendListSlice.actions;
export const currentFriendList= (state:RootState)=>state.friendList;
export default friendListSlice.reducer
