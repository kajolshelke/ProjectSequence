import { io } from "../server/index.js";


export default function destroyRoomBroadcast(roomID:string){

    // ---------- Emitting updated room to everyone in room -------- //
    io.to(roomID).emit("roomDestroy","Room Destroyed");
    io.socketsLeave(roomID);
}