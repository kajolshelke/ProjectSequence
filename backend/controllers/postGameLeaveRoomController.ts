import { Socket } from "socket.io";
import { z } from "zod";
import db from "../db/redisConfig.js";
import { events } from "../events/events.js";
import { io } from "../server/index.js";
import { Room } from "../types/types.js";
import { playerValidationSchema, roomIDValidationSchema } from "../validation/validationSchema.js";

export default async function postGameLeaveRoomController(socket:Socket,roomID : string,playerID:string) {
    try {


        
    // ------------------- Validation of host input for room destroy ---------------------- //

    const validationSchema = z.object({
                        playerID:playerValidationSchema.shape.id,
                        roomID:roomIDValidationSchema
                    })
    const validationResult = validationSchema.safeParse({roomID,playerID});

    if(!validationResult.success){
        throw new Error(validationResult.error.errors[0].message)
    }

    //---------------------------- Check if the Command is from the host ---------------------------------------- //

    const room = await db.get(roomID);

    // --------- To check whether room exists or not ------- //

    if(room === null){
        throw new Error("Room doesn't exist")
    }

    // -------- Getting room data from database ------ //
    const data:Room = JSON.parse(room);

  

    // --------- To check whether the player with given name exists in room -------//

    const playerCheck = data.players.filter(x => x.id === playerID);

    if(playerCheck.length !== 1){
        throw new Error("Player doesn't exist")
    }

   if(!data.status){
    throw new Error("Cannot destroy room")
   }


    //------------------- Delete the room from database ---------------------- //

    await db.DEL(roomID);

    // --------------- Notifying room has been destroyed ------------- //



     io.to(roomID).emit(events.postGameLeaveRoom.name)

    

    } catch (error:any) {

        //------------------- Notifying error --------------------- //  

        socket.emit("userError",error.message)
    }

}