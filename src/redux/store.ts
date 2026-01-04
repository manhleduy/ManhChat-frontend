import {combineReducers, configureStore} from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import {persistReducer, persistStore} from "redux-persist"

import socketMiddleware from "./middleware/socketMiddleware"

import usersReducer from './slice/userSlice'
import friendListReducer from './slice/FriendListSlice'
import groupListReducer from './slice/GroupListSlice'
import FriendRequestReducer from './slice/FriendRequestSlice'
import GroupRequestReducer from './slice/GroupRequestSlice'
import PostListReducer from './slice/PostListSlice'
import ChatReceivedReducer from './slice/ChatReceivedSlice'
import onlineUserReducer from './slice/onlineUserSlice'
const rootReducer= combineReducers({
    users: usersReducer,
    friendList: friendListReducer,
    groupList: groupListReducer,
    friendRequest: FriendRequestReducer,
    groupRequest: GroupRequestReducer,
    postList: PostListReducer,
    ChatReceivedList: ChatReceivedReducer,
    onlineUserList: onlineUserReducer
})
const persistConfig={
    key:"root",
    storage
}

export const store: any= configureStore({
    reducer: persistReducer(persistConfig, rootReducer), 
    middleware: (getDefaultMiddleware)=>{
        
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
            }
        }).concat(socketMiddleware);
    }
})
export type AppStore= typeof store
export const persistor= persistStore(store);
export type RootState= ReturnType<AppStore['getState']>;
export type AppDispatch= AppStore['dispatch']




