import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { GroupRequest} from "@/lib/const";
import { getAllGroupRequest } from "@/lib/services/invitationService";
const initialState: {
  invitations:GroupRequest[],
  proposals:GroupRequest[]
  error:any, 
  status:string}= {
    invitations: [],
    proposals: [],
    error:"",
    status:"completed"
  }
export const groupRequestSlice=createSlice({
    name:"groupRequest",
    initialState,
    reducers:{
      deleteGroupRequest:(state, action: PayloadAction<number>)=>{
        
      }
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getAllGroupRequest,{
        fulfilled:(state,action)=>{
          state.error="",
          state.invitations= action.payload.joinRequests,
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
      selectGroupRequest: (state)=>state
      
    }

})
export const {} = groupRequestSlice.actions;
export const {selectGroupRequest}= groupRequestSlice.selectors;
export default groupRequestSlice.reducer
