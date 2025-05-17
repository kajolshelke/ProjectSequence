import { io, Socket } from "socket.io-client";

const socket : Socket = io("https://sequencess.com",{
    path:"/ws",
    autoConnect : false,
    reconnectionDelay : 5000,
    reconnectionAttempts : 3
});

export default socket