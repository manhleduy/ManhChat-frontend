import {configureStore} from "@reduxjs/toolkit"
import errorReducer from './ErrorSlice'
import loadingReducer from './LoadingSlice'
import usersReducer from './userSlice'
import friendListReducer from './FriendListSlice'
export const store= configureStore({
    reducer:{
        users:usersReducer,
        error: errorReducer,
        friendList: friendListReducer,
        isLoading: loadingReducer,
    }
})
export type RootState= ReturnType<typeof store.getState>;
export type Dispatch= typeof store.dispatch
export type Store= typeof store




