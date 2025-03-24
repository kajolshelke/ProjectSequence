import { Socket } from "socket.io";
import db from "../db/redisConfig.js";
import { playerValidationSchema, roomIDValidationSchema, roomValidationSchema } from "../validation/validationSchema.js";
import { Player,Room } from "../types/types.js";
import z from "zod";
import preGameBroadcastController from "./preGameBroadcast.js";

export default async function lobbySettingsUpdate(socket:Socket,roomID:string,duration:number,totalTeams:number,nickname:string) {

    try {

        // --- Validation of room ID, player turn duration & no.of total teams for lobby settings update --- //

        const validationSchema = z.object({
            nickname:playerValidationSchema.shape.name,
            roomID: roomIDValidationSchema,
            duration:roomValidationSchema.shape.duration,
            totalTeams:roomValidationSchema.shape.totalTeams
        })

        const validationResult = validationSchema.safeParse({roomID,duration,totalTeams,nickname});

        if(!validationResult.success){
            throw new Error(validationResult.error.errors[0].message)
        }

        //  ------- Extracting the data after validation ----- //

        const validData = validationResult.data;
        console.log(validData,"p")



        

        const room = await db.get(roomID);


        // --------- To check whether room exists or not ------- //

        if(room === null){
            throw new Error("Room doesn't exist")
        }

        // -------- Getting room data from database ------ //
        const data:Room = JSON.parse(room);


        // --------- To check whether the player with given nmae exists in room -------//

        const hostCheck = data.players.filter(x => x.name === nickname);

        if(hostCheck.length !== 1){
            throw new Error("Player doesn't exist")
        }


        // --------- To check if the lobby settings are requested to be altered by host of room ---------//

        if(!hostCheck[0].host){
            throw new Error("Player is not a host")
        }



        // ----- Checking the existing no. of total teams ---- //
       
        const oldTotalTeamsCount = data.totalTeams;

        // ----- Checking whether the old no. of teams is 3 and new no. of teams is 2 ...
        // ... so the players in team 3 should be alternatively distributed between teams 1 and 2 ------ // 
        if(oldTotalTeamsCount === 3 && validData.totalTeams === 2){
            const playersList = [...data.players];

            // To put team C or team 3 members alternatively in teams A and B
            let parity = 0;  
            playersList.forEach(x => {
                if(x.team === "C"){
                    if(parity === 0){
                        x.team = "A";
                        parity = 1;
                    }else{
                        x.team = "B";
                        parity = 0;
                    }
                }
            } )

            //  Setting the data with updated teams and player list
            data.players = playersList;
        }

        // ------ Updating the player turn duration and total teams no. ----- // 
        data.duration = validData.duration;
        data.totalTeams = validData.totalTeams;


        console.log(data,"f")


        //  ----- Updating the database with these changes ----- //

        await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})

        

        preGameBroadcastController(roomID,data.players,data.totalTeams,data.duration);

        
    } catch (error:any) {
        // ---- Notifying error ----- //
        
        socket.emit("userError",error.message)
    }
    
}


