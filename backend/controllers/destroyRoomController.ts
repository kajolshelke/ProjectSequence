import type {Socket} from "socket.io";
import db from "../db/redisConfig.js";
import { playerValidationSchema, roomIDValidationSchema } from "../validation/validationSchema.js";
import z from "zod";
import { Room } from "../types/types.js";
import { io } from "../server/index.js";
import { events } from "../events/events.js";

export default async function destroyRoomController(socket:Socket,roomID : string,playerID:string){

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

    const hostCheck = data.players.filter(x => x.id === playerID);

    if(hostCheck.length !== 1){
        throw new Error("Player doesn't exist")
    }

    // --------- To check if the lobby settings are requested to be altered by host of room ---------//

    if(!hostCheck[0].host){
        throw new Error("Player is not a host")
    }



    //------------------- Delete the room from database ---------------------- //

    await db.DEL(roomID);

    // --------------- Notifying room has been destroyed ------------- //



     io.to(roomID).emit(events.roomStateAcknowledgement.name,roomID,data.players,data.totalTeams,data.duration,data.status,true)

    

    } catch (error:any) {

        //------------------- Notifying error --------------------- //  

        socket.emit("userError",error.message)
    }

    



}