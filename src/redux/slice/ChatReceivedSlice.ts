import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FriendChatBlock, GroupChatBlock } from "@/lib/const";
const initialState:{
    friendChats:FriendChatBlock[];
    groupChats:GroupChatBlock[]
}={
    friendChats:[],
    groupChats:[]
}
export const chatReceivedSlice=createSlice({
    name:"ChatReceivedList",
    initialState,
    reducers:{
      pushFriendChat:(state, action: PayloadAction<FriendChatBlock>)=>{   
        state.friendChats=[...state.friendChats,action.payload]   
        return state;
      },
      pushGroupChat:(state, action: PayloadAction<GroupChatBlock>)=>{
        state.groupChats=[...state.groupChats,action.payload]
        return state;
      },
      popFriendChat:(state, action: PayloadAction<number>)=>{      
        state.friendChats= state.friendChats.filter((chat:any)=>chat.senderId!==action.payload) 
        return state;       
      },
      popGroupChat:(state, action: PayloadAction<number>)=>{  
        state.groupChats=state.groupChats.filter((chat:any)=>chat.groupId!==action.payload)
        return state;
      },
      restartList:(state)=>{
        state.friendChats=[];
        state.groupChats=[];
      }
    },
    extraReducers:(builder)=>{
      builder.addCase("SOCKET_DISCONNECT",(state)=>{
        state.friendChats=[];
        state.groupChats=[];
      })
    },
    selectors:{
      selectChatReceivedList:(state)=>state
      
    }

})
export const {popFriendChat, popGroupChat, pushFriendChat, pushGroupChat, restartList} = chatReceivedSlice.actions;
export const {selectChatReceivedList}= chatReceivedSlice.selectors;
export default chatReceivedSlice.reducer
