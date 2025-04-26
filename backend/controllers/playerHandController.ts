import { Socket } from "socket.io";
import {
  playerValidationSchema,
  roomIDValidationSchema,
} from "../validation/validationSchema.js";
import { z } from "zod";
import { Room } from "../types/types.js";
import db from "../db/redisConfig.js";

export async function playerHandController(
  socket: Socket,
  playerID: string,
  roomID: string
) {

  try {
    const validationSchema = z.object({
      playerID: playerValidationSchema.shape.id,
      roomID: roomIDValidationSchema,
    });
  
    const validationResult = validationSchema.safeParse({ playerID, roomID });
  
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
  
  
    const room = await db.get(roomID);
  
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
  
       const playerHand = playerCheck[0].hand;

       const firstPLayerTurn = data.players.filter(x => x.id === data.turn)[0];

       const firstPLayerTurnName = firstPLayerTurn.name;
       const firstPLayerTurnTeam = firstPLayerTurn.team;
  
       socket.emit("playerHandFirstUpdate",playerHand,data.drawDeck!.length,firstPLayerTurnName,firstPLayerTurnTeam,data.duration,firstPLayerTurn.id);
  } catch (error:any) {
    // ---- Notifying error ----- //
        
    socket.emit("userError",error.message)

  }
  

}
