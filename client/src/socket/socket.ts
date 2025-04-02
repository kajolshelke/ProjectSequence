import { io, Socket } from "socket.io-client";

const socket : Socket = io("http://localhost:3000",{
    autoConnect : false,
    reconnectionDelay : 5000,
    reconnectionAttempts : 3
});

export default socket