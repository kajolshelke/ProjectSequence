import { Socket } from "socket.io";
import db from "../db/redisConfig.js";
import { events } from "../events/events.js";

export default async function doesRoomExistController(socket:Socket, roomIDFromURL:string) {
    try {
        const room = await db.get(roomIDFromURL);

          if(room === null){
          socket.emit(events.roomCheck.name,false)
          }else{
            socket.emit(events.roomCheck.name,true);
          }

        

    } catch (error:any) {
        // ---- Notifying error ----- //
     socket.emit("userError",error.message)
    }
    
}