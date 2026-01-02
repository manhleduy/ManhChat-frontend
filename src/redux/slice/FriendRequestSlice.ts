import { createSlice} from "@reduxjs/toolkit";
import type { FriendRequest} from "@/lib/const";
import { getAllRequest } from "@/lib/services/invitationService";
const initialState: {
  invitations:FriendRequest[],
  proposals:FriendRequest[]
  error:any, 
  status:string}= {
    invitations: [],
    proposals: [],
    error: "",
    status: "completed"
  }
export const friendRequestSlice=createSlice({
    name:"friendRequest",
    initialState,
    reducers:{
      
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getAllRequest,{
        fulfilled:(state,action)=>{
          state.error="",
          state.invitations= action.payload.invitations,
          state.proposals= action.payload.proposals,
          state.status="completed"
        },
         pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error",
          state.proposals=[],
          state.invitations=[],
          state.status="failed"
        }
      })
    },
    selectors:{
      selectFriendRequest: (state)=>state
      
    }

})
export const {} = friendRequestSlice.actions;
export const {selectFriendRequest}= friendRequestSlice.selectors;
export default friendRequestSlice.reducer
