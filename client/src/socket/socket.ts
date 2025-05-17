import { io, Socket } from "socket.io-client";

const socket : Socket = io("http://3.7.126.228",{
    path:"/ws",
    autoConnect : false,
    reconnectionDelay : 5000,
    reconnectionAttempts : 3
});

export default socket