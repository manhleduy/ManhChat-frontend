import {combineReducers, configureStore} from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import {persistReducer, persistStore} from "redux-persist"
import usersReducer from './userSlice'
import friendListReducer from './FriendListSlice'
import groupListReducer from './GroupListSlice'
import FriendRequestReducer from './FriendRequestSlice'
import GroupRequestReducer from './GroupRequestSlice'
const rootReducer= combineReducers({
    users: usersReducer,
    friendList: friendListReducer,
    groupList: groupListReducer,
    friendRequest: FriendRequestReducer,
    groupRequest: GroupRequestReducer
})
const persistConfig={
    key:"root",
    storage
}

export const store= configureStore({
    reducer: persistReducer(persistConfig, rootReducer), 
    middleware: (getDefaultMiddleware)=>{
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
            }
        })
    }
})
export type AppStore= typeof store
export const persistor= persistStore(store);
export type RootState= ReturnType<AppStore['getState']>;
export type AppDispatch= AppStore['dispatch']




