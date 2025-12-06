import { createSlice} from "@reduxjs/toolkit";
import type { RootState } from "./store";

const initialState: boolean= false;
export const loadingSlice=createSlice({
    name:"isLoading",
    initialState,
    reducers:{
        StartLoading:(state)=>{
            return true;
        },
        StopLoading:(state)=>{
            return false;
        }
}})
export const {StartLoading,StopLoading} = loadingSlice.actions;
export const currentLoadingState= (state:RootState)=>state.isLoading;
export default loadingSlice.reducer
