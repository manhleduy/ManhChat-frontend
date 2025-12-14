import { useSelector,useDispatch, type TypedUseSelectorHook } from "react-redux";
import type { Dispatch, RootState, Store } from "./store";

export const useUsersDispatch: ()=> Dispatch= useDispatch
export const useErrorDispatch: ()=> Dispatch= useDispatch
export const useIsLoadingDispatch: ()=> Dispatch= useDispatch
export const useFriendListDispatch: ()=> Dispatch= useDispatch
export const useUsersSelector: TypedUseSelectorHook<RootState>= useSelector
