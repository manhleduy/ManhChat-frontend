import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
export interface ResponseError{
  errorStatus: number,
  message: string
}
const initialState: ResponseError= {
    errorStatus: 0,
    message: "no error",
}
export const errorSlice=createSlice({
    name:"error",
    initialState,
    reducers:{
      triggerError:(state,action: PayloadAction<ResponseError>)=>{
        return action.payload;
      },
      removeError:(state)=>{
        return initialState

      }
    }
})
export const {triggerError, removeError} = errorSlice.actions;
export const currentError= (state:RootState)=>state.error;
export default errorSlice.reducer
