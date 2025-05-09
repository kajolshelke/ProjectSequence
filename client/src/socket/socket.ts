import { io, Socket } from "socket.io-client";

const socket : Socket = io("https://tqv7tt4c-3000.inc1.devtunnels.ms/",{
    autoConnect : false,
    reconnectionDelay : 5000,
    reconnectionAttempts : 3
});

export default socket