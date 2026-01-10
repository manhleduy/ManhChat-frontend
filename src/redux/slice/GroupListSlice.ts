import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GroupBlockInfo} from "@/lib/const";
import { getAllGroup } from "@/lib/services/groupService";
const initialState: {
  groupList:GroupBlockInfo[],
  error:any, 
  status:string}= {
    groupList:[],
    error:"",
    status:"completed"
  }
export const groupListSlice=createSlice({
    name:"groupList",
    initialState,
    reducers:{
      
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getAllGroup,{
        fulfilled:(state,action)=>{
          state.error="",
          state.groupList= action.payload,
          state.status="completed"
        },
         pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error"
          state.groupList=[]
          state.status="failed"
        }
      })
    },
    selectors:{
      selectGroupList: (state)=>state
      
    }

})
export const {} = groupListSlice.actions;
export const {selectGroupList}= groupListSlice.selectors;
export default groupListSlice.reducer
