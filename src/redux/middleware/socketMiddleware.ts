import socket from "@/lib/socket";
import {type Middleware } from "redux";
import {type RootState } from "../store";
const socketMiddleware: Middleware<{}, RootState> =
(store) => (next) => (action:any) => {

    switch (action.type) {

        case "SOCKET_CONNECT":
            
                socket.io.opts.query = {
                    userId: action.payload
                };
                socket.connect();
            
            break;

        case "SOCKET_DISCONNECT":
            socket.disconnect();
            break;
    }

    // ✅ Always pass action forward
    return next(action);
};

export default socketMiddleware;