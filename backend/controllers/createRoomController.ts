import type {Socket} from "socket.io";
import { v4 } from "uuid";
import db from "../db/redisConfig.js";
import { Player,Room } from "../types/types.js";
import { playerValidationSchema } from "../validation/validationSchema.js";

export default async function createRoomController(socket:Socket,nickname:string){

    try {
        
    // ------------------- Validation of host input for room creation ---------------------- //

    const validationSchema = playerValidationSchema.shape.name;
    const validationResult = validationSchema.safeParse(nickname);

    if(!validationResult.success){
        throw new Error(validationResult.error.errors[0].message)
    }


    // -------------------------- Setting up default value for room ------------------------- //

    const roomID = v4();
    
    const player:Player = {
        name:nickname,
        team:"A",
        time:null,
        hand:null,
        host:true
    } 

    const room:Room = {
        players:[player],
        totalTeams:2,
        status:false,
        turn:nickname,
        duration:120000,
        teamASequenceCount:0,
        teamBSequenceCount:0,
        teamCSequenceCount:0,
        drawDeck:[""],
        gameState:[""]
    } 


    // -------------------------------- Inserting room into database -------------------- //


    await db.setEx(roomID,Number(process.env.ROOM_DESTROY_TIME),JSON.stringify(room))

    // --------------------------------- Host joining the room ------------------------- //

    socket.join(roomID);
        

    // --------------- Notifying room has been set & host has joined the room ------------- //

    socket.emit("roomCreated",{roomID});



    

    } catch (error:any) {

        //------------------- Notifying error --------------------- //  

        socket.emit("userError",error.message)
    }

    



}