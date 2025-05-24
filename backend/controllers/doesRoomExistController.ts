import { Socket } from "socket.io";
import db from "../db/redisConfig.js";
import { events } from "../events/events.js";

export default async function doesRoomExistController(socket:Socket, roomIDFromURL:string) {

  console.log(roomIDFromURL)
    try {
        const room = await db.get(roomIDFromURL);

          let roomCheck;
          if(room === null){
            roomCheck = false;
            console.log(roomCheck)
            socket.emit(events.roomCheck.name,roomCheck);
          }else{
            roomCheck = true;
            console.log(roomCheck)
            socket.emit(events.roomCheck.name,roomCheck);
          }

        

    } catch (error:any) {
        // ---- Notifying error ----- //
     socket.emit("userError",error.message)
    }
    
}