import socket from "@/lib/socket";
import {type Middleware } from "redux";
import {type RootState } from "../store";
import { setOnlineUsers } from "../slice/onlineUserSlice";
const socketMiddleware: Middleware<{}, RootState> =
(store) => (next) => (action:any) => {

    switch (action.type) {
        case "SOCKET_CONNECT":
            const newUserId = action.payload;

            if (socket.connected && socket.io.opts.query.userId === newUserId) {
                return; 
            }

            if (socket.active && !socket.connected) {
                return; 
            }

            if (socket.connected && socket.io.opts.query.userId !== newUserId) {
                socket.disconnect();
            }

            socket.io.opts.query = { userId: newUserId };
            socket.connect();
            socket.on("getAllOnlineUsers", (data: number[]) => {
        // Dispatch a standard Redux action with the data
                store.dispatch(setOnlineUsers(data)); 
            });
            
            break;
        case "SOCKET_DISCONNECT":
            socket.disconnect();
            
            break;
        case "SOCKET_SEND_MESSAGE":
        
            
            break;
        default:
            
            break;
    }

    // ✅ Always pass action forward
    return next(action);
};

export default socketMiddleware;