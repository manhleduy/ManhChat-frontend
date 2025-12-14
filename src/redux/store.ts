import {configureStore} from "@reduxjs/toolkit"

import usersReducer from './userSlice'
import friendListReducer from './FriendListSlice'
export const store= configureStore({
    reducer:{
        users:usersReducer,
        friendList: friendListReducer,
        
    }
})
export type RootState= ReturnType<typeof store.getState>;
export type Dispatch= typeof store.dispatch
export type Store= typeof store




