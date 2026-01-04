import socket from "@/lib/socket";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const initialState:number[]=[]

export const onlineUserSlice=createSlice({
    name:"onlineUserList",
    initialState,
    reducers:{
        addOnlineUser: (state, action: PayloadAction<number>)=>{
            if(!state.includes(action.payload) && action.payload!==0){
          
                state.push(action.payload);
            }
            return state;
        },
        removeOnlineUser: (state, action: PayloadAction<number>)=>{
            state= state.filter((userId)=>userId!==action.payload)
            return state;
        },
        setOnlineUsers:(state, action: PayloadAction<number[]>)=>{
            state= action.payload;
            return state;
        }
    },
    extraReducers:(builder)=>{
      builder
      .addCase("SOCKET_DISCONNECT",(state)=>{
        state=[]
        return state;
      })
      
    },
    selectors:{
      selectOnlineUserList:(state)=>state,
      
    }

})
export const {addOnlineUser, removeOnlineUser, setOnlineUsers} = onlineUserSlice.actions;
export const {selectOnlineUserList}= onlineUserSlice.selectors;
export default onlineUserSlice.reducer
