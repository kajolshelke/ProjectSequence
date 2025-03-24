import type {Socket} from "socket.io";
import db from "../db/redisConfig.js";
import { Room } from "../types/types.js";
import { roomIDValidationSchema,playerValidationSchema } from "../validation/validationSchema.js";
import z from "zod";
import preGameBroadcastController from "./preGameBroadcast.js";


export default async function getRoomStateController(socket:Socket,roomID:string,nickname:string) {

    try {

        // ---------- Validation of room ID and nickname to send current room state -------- //   

        const validationSchema = z.object({
                    nickname:playerValidationSchema.shape.name,
                    roomID:roomIDValidationSchema
                })
        
        const validationResult = validationSchema.safeParse({nickname,roomID})
        
        if(!validationResult.success){
            throw new Error(validationResult.error.errors[0].message)
        }

        const validData = validationResult.data;


    

        const room = await db.get(roomID)

        // ------------ To check whether a room exists or not ---------- //

        if(room === null){
            throw new Error("Room doesn't exist")
        }


        // --------- Extracting room data from given room ID -------- //

        const data:Room = JSON.parse(room);


        // ------------ To check whether the player exists in room  ------ //

        const playerList = [...data.players];

        if(playerList.filter(x => x.name === validData.nickname).length !== 1){
            throw new Error("Player not found")
        }

        

        // ------------- Notifying the current room state ---------- //

        preGameBroadcastController(roomID,data.players,data.totalTeams,data.duration);
        

        

        
    } catch (error:any) {

        // ---------- Notifying error ------------- //

        socket.emit("userError",error.message)
    }
    
}