import { io } from "../server/index.js";
import { Player } from "../types/types.js";


export default function preGameBroadcastController(roomID:string,players:Player[], totalTeams:number,duration:number){

    // ---------- Emitting updated room to everyone in room -------- //

    io.to(roomID).emit("preGameUpdate",players,totalTeams,duration);

}