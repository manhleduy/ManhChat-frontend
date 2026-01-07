import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { GroupRequest} from "@/lib/const";
import { getAllGroupRequest } from "@/lib/services/invitationService";
const initialState: {
  receivedRequests:GroupRequest[],
  sentRequests:GroupRequest[]
  error:any, 
  status:string}= {
    receivedRequests: [],
    sentRequests: [],
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
      selectGroupRequest: (state)=>state
      
    }

})
export const {} = groupRequestSlice.actions;
export const {selectGroupRequest}= groupRequestSlice.selectors;
export default groupRequestSlice.reducer
