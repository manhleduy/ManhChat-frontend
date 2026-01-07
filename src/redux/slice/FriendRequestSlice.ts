import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { FriendRequest} from "@/lib/const";
import { getAllRequest } from "@/lib/services/invitationService";
const initialState: {
  receivedRequests:FriendRequest[],
  sentRequests:FriendRequest[]
  error:any, 
  status:string}= {
    receivedRequests: [],
    sentRequests: [],
    error: "",
    status: "completed"
  }
export const friendRequestSlice=createSlice({
    name:"friendRequest",
    initialState,
    reducers:{
        pushFriendReceivedRequest:(state, action: PayloadAction<FriendRequest>)=>{
          state.receivedRequests.push(action.payload)
          return state;
        },
        popFriendReceivedRequest: (state, action: PayloadAction<number>)=>{
          state.receivedRequests= state.receivedRequests.filter((request)=>request.id!==action.payload)
          return state;
        },
        pushFriendSentRequest:(state, action: PayloadAction<FriendRequest>)=>{
          state.sentRequests.push(action.payload)
          return state;
        },
        popFriendSentRequest: (state, action: PayloadAction<number>)=>{
          state.sentRequests=state.sentRequests.filter((request)=>request.id!==action.payload)
          return state;
        }
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getAllRequest,{
        fulfilled:(state,action)=>{
          state.error="",
          state.receivedRequests= action.payload.receivedRequests,
          state.sentRequests= action.payload.sentRequests,
          state.status="completed"
        },
         pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error",
          state.sentRequests=[],
          state.receivedRequests=[],
          state.status="failed"
        }
      })
    },
    selectors:{
      selectFriendRequest: (state)=>state
      
    }

})
export const {pushFriendReceivedRequest, popFriendReceivedRequest, pushFriendSentRequest, popFriendSentRequest} = friendRequestSlice.actions;
export const {selectFriendRequest}= friendRequestSlice.selectors;
export default friendRequestSlice.reducer
