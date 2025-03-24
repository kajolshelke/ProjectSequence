import type {Socket} from "socket.io";
import db from "../db/redisConfig.js";
import { Room } from "../types/types.js";
import z from "zod";
import { playerValidationSchema,roomIDValidationSchema } from "../validation/validationSchema.js";
import preGameBroadcastController from "./preGameBroadcast.js";


export default async function joinRoomController(socket:Socket,nickname:string,roomID:string) {

    try {

        // ---------- Validation of room ID and player name when player joins through link -------- //

        const validationSchema = z.object({
            nickname:playerValidationSchema.shape.name,
            roomID:roomIDValidationSchema
        })

        const validationResult = validationSchema.safeParse({nickname,roomID})

        if(!validationResult.success){
            throw new Error(validationResult.error.errors[0].message)
        }

        

        // ------- To check whether room exists or not -------- //

        const room = await db.get(roomID)

        if(room === null){
            throw new Error("Room doesn't exist")
        }


        // ---------------- To check whether a player can join the room now ------------- //
        
        const data:Room = JSON.parse(room);

        if(data.status){
            throw new Error("Ongoing game, cannot join now")
        }

        if(data.players.length === 12){
            throw new Error("Room is full,cannot join now")
        }
        

        if(data.players.filter(x=>x.name === nickname).length>=1){
            throw new Error("Player with this name already exists in the room")
        }


        // ----- When a player joins room, they will be initially placed in teams as per the following  ----- //


        // If the game has only 2 teams, counting no. of players in each team so that the new incoming player
        // will be placed in team with less members
        let teamACount = data.players.filter(x => x.team === "A").length;
        let teamBCount = data.players.filter(x => x.team === "B").length;


        // If the game has 3 teams, counting no. of players in each team so that the new incoming player
        // will be placed in team with less members
        if(data.totalTeams === 3){
            let teamCCount = data.players.filter(x => x.team === "C").length;

            if(teamACount <= teamBCount && teamACount <= teamCCount){
                data.players.push({name:nickname,team:"A",time:null,hand:null,host:false })
            }else if(teamBCount <= teamACount && teamBCount <= teamCCount){
                data.players.push({name:nickname,team:"B",time:null,hand:null,host:false })
            }else{
                data.players.push({name:nickname,team:"C",time:null,hand:null,host:false })
                }
        }else{
            if(teamACount <= teamBCount){
                data.players.push({name:nickname,team:"A",time:null,hand:null,host:false })
            }else{
                data.players.push({name:nickname,team:"B",time:null,hand:null,host:false })
            }
        }


        // -------- New Player joins the room ------ //

        socket.join(roomID)


        

        // ---------------- Updating the database by adding new player in the room ------------ //
        await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})


        // ------------ Notifying the updated roomstate of players --------- //
        // ---------- Updating the front end with pre game/lobby changes --------- //

        preGameBroadcastController(roomID,data.players, data.totalTeams, data.duration)

        

        
            
    } catch (error:any) {
        // ------------------- Notifying error --------------- //

        socket.emit("userError",error.message)
    }
    
}