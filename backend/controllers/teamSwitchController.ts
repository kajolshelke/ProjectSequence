import type {Socket} from "socket.io";
import db from "../db/redisConfig.js";
import { Room } from "../types/types.js";
import z from "zod";
import { playerValidationSchema,roomIDValidationSchema } from "../validation/validationSchema.js";
import preGameBroadcastController from "./preGameBroadcast.js";


export default async function teamSwitchController(socket:Socket,team:string,roomID:string,nickname:string) {

    try {

        // ---------- Validation of player name, room ID & switching of team name for a player ------- //
        
        const validationSchema = z.object({
            nickname:playerValidationSchema.shape.name,
            roomID:roomIDValidationSchema,
            team:playerValidationSchema.shape.team
        })

        const validationResult = validationSchema.safeParse({team,roomID,nickname})

        if(!validationResult.success){
            throw new Error(validationResult.error.errors[0].message)
        }

        // -------------- Extracting data after validating --------- // 

        const validData = validationResult.data
        

        

        // --------- To check whether the room for given room ID exists or not -------- //

        const room = await db.get(roomID);

        if(room === null){
            throw new Error("Room doesn't exist")
        }


        // -------- Getting room data from database ---------- //

        const data:Room = JSON.parse(room);
    

        // ----------- To check whether a player can switch teams ---------- //
 
        if(data.status){
            throw new Error("Ongoing game, cannot switch team now")
        }

        if(data.totalTeams === 2 && validData.team === "C"){
            throw new Error("Team C not available")
        }

        // ------------ To check whether the player exists in room  ------ //

        const playerList = [...data.players];

        if(playerList.filter(x => x.name === validData.nickname).length !== 1){
            throw new Error("Player not found")
        }

        //  -------- Findind the given player in room to change their team ------- //
        data.players.forEach( x => {
            if(x.name === validData.nickname){
                x.team = validData.team ;
            }
        })
        

        // ---------- Updating the database with new teams' players ---------- //
        await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})

        

        // ---------- Updating the front end with pre game/lobby changes --------- //
        preGameBroadcastController(roomID,data.players,data.totalTeams,data.duration);



    } catch (error:any) {
        //  --------------- Notifying error ---------------- //

        socket.emit("userError",error.message)
    }


}