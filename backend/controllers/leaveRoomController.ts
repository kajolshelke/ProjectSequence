import { Socket } from "socket.io";
import db from "../db/redisConfig.js";
import { playerValidationSchema, roomIDValidationSchema, roomValidationSchema } from "../validation/validationSchema.js";
import { Player,Room } from "../types/types.js";
import z from "zod";
import preGameBroadcastController from "./preGameBroadcast.js";
import { io } from "../server/index.js";
import { events } from "../events/events.js";

export default async function leaveRoomController(socket:Socket,roomID:string,playerID:string) {

    try {

        // --- Validation of room ID, player turn duration & no.of total teams for lobby settings update --- //

        const validationSchema = z.object({
            playerID:playerValidationSchema.shape.id,
            roomID: roomIDValidationSchema,
        })

        const validationResult = validationSchema.safeParse({roomID,playerID});

        if(!validationResult.success){
            throw new Error(validationResult.error.errors[0].message)
        }

        //  ------- Extracting the data after validation ----- //

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

        if(hostCheck[0].host){
            throw new Error("Host cannot leave the room")
        }

        const updatedPlayers = data.players.filter((x) => x.id !== playerID);

        data.players = updatedPlayers;

        //  ----- Updating the database with these changes ----- //

        await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})

        socket.leave(roomID);

        io.to(roomID).emit(events.roomStateAcknowledgement.name,roomID,data.players,data.totalTeams,data.duration,data.status,false)
        

    

        
    } catch (error:any) {
        // ---- Notifying error ----- //
        
        socket.emit("userError",error.message)
    }
    
}