import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FriendChatBlock, GroupChatInfo } from "@/lib/const";
const initialState:{
    friendChats:FriendChatBlock[];
    groupChats:GroupChatInfo[]
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
      pushGroupChat:(state, action: PayloadAction<GroupChatInfo>)=>{
        state.groupChats=[...state.groupChats,action.payload]
      },
      popFriendChat:(state, action: PayloadAction<FriendChatBlock>)=>{      
        state.friendChats= state.friendChats.filter((chat:any)=>chat.senderId!==action.payload.senderId)        
      },
      popGroupChat:(state, action: PayloadAction<GroupChatInfo>)=>{  
        state.groupChats=state.groupChats.filter((chat:any)=>chat.chatGroupId!==action.payload.chatGroupId)
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
