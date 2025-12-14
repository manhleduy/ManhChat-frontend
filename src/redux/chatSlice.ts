import type { ChatBlockInfo } from "@/lib/const";
import { GetAllChat } from "@/lib/services/chatService";
import { createSlice } from "@reduxjs/toolkit";

const initialState:{
    error:any, 
    chatList:ChatBlockInfo[],
    status: string
}={
    error:"",
    chatList:[],
    status:"completed"
}
export const chatSlice= createSlice({
    name:"chatlist",
    initialState,
    reducers:{
        
    },
    extraReducers:(builder)=>{
        builder.addAsyncThunk(GetAllChat,{
            fulfilled:(state,action)=>{
            state.error="",
            state.chatList= action.payload,
            state.status="completed"
            },
            pending:(state)=>{
            state.status= "pending"
            },
            rejected:(state, action)=>{
            state.error= action.payload || "unknown error"
            state.chatList=[]
            state.status="failed"
            }
        })

    },
    selectors:{
        selectChatList: (state)=>state
    }
})
export const {} = chatSlice.actions;
export const {selectChatList}= chatSlice.selectors
export default chatSlice.reducer
