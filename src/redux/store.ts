import {configureStore} from "@reduxjs/toolkit"

import usersReducer from './userSlice'
import friendListReducer from './FriendListSlice'
export const store= configureStore({
    reducer:{
        users:usersReducer,
        friendList: friendListReducer,
        
    }
})
export type AppStore= typeof store
export type RootState= ReturnType<AppStore['getState']>;
export type AppDispatch= AppStore['dispatch']




