import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PostDefaultInfo } from "@/lib/const";
import { getFriendList } from "@/lib/services/friendService";
import { getAllFriendPost, getAllPost } from "@/lib/services/postService";
const initialState: {
  userPostList: PostDefaultInfo[],
  friendPostList: PostDefaultInfo[],
  error:any, 
  status:string}= {
    userPostList:[],
    friendPostList: [],
    error:"",
    status:"completed"
  }
export const postListSlice=createSlice({
    name:"postList",
    initialState,
    reducers:{
      deletePost:(state, action: PayloadAction<number>)=>{
        
      },
      likePost:(state, action: PayloadAction<number>)=>{

      }
    },
    extraReducers:(builder)=>{
      builder
      .addAsyncThunk(getAllPost,{
        fulfilled:(state,action)=>{
          state.error="",
          state.userPostList= action.payload,
          state.status="completed"
        },
         pending:(state)=>{
          state.status= "pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error"
          state.userPostList=[]
          state.status="failed"
        }
      })
      .addAsyncThunk(getAllFriendPost,{
        fulfilled: (state, action)=>{
          state.error="",
          state.friendPostList= action.payload,
          state.status="completed"
        },
        pending:(state)=>{
          state.status="pending"
        },
        rejected:(state, action)=>{
          state.error= action.payload || "unknown error"
          state.friendPostList=[]
          state.status="failed"
        }
      })
    },
    selectors:{
      selectUserPostList: (state)=>state.userPostList,
      selectFriendPostList: (state)=>state.friendPostList
      
    }

})
export const {deletePost, likePost} = postListSlice.actions;
export const {selectUserPostList, selectFriendPostList}= postListSlice.selectors;
export default postListSlice.reducer
