import { z } from "zod";
import { playerValidationSchema, roomIDValidationSchema } from "../validation/validationSchema.js";
import db from "../db/redisConfig.js";
import { Player, Room } from "../types/types.js";
import deck from "../game logic/cardDeck.js";
import { Socket } from "socket.io";
import { io } from "../server/index.js";
import { boardState } from "../game logic/initialBoardState.js";
import { events } from "../events/events.js";


function shuffleDeck(deck:{rank:number,suit:"Club"|"Heart"|"Diamond"|"Spade"}[]){


    for(let i = deck.length-1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  
    return deck
  
  }

export async function gameStartController(socket:Socket,playerID:string,roomID:string){



  try {
           const validationSchema = z.object({
                playerID:playerValidationSchema.shape.id,
                roomID: roomIDValidationSchema,
            })

          const validationResult = validationSchema.safeParse({playerID,roomID});
          

          if(!validationResult.success){
    
          throw new Error(validationResult.error.errors[0].message)
          }




          const room = await db.get(roomID);

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



          const deckCopy = [...deck];

          const gameDeck = shuffleDeck(deckCopy);


          const totalPlayers = data.players.length;
          const totalTeams = data.totalTeams;
          let cardsPerPlayer = data.noOfCardsPerPlayer;

          if(totalPlayers % totalTeams !== 0){
          throw new Error("Cannot make balanced team");
          }



          // for 2 pcs
          cardsPerPlayer = 7;  

          if(totalPlayers === 3 || totalPlayers === 4){
          cardsPerPlayer = 6;
          }else if(totalPlayers === 6){
          cardsPerPlayer = 5;
          }else if(totalPlayers === 8 || totalPlayers === 9){
          cardsPerPlayer = 4;
          }else if(totalPlayers === 10 || totalPlayers === 12){
          cardsPerPlayer = 3;
          }




          const playersList = data.players;

          playersList.forEach((player)=>{

          player.hand = gameDeck.splice(0,cardsPerPlayer);

          })

          let teamACount = 0;
          let teamBCount = 1;
          let teamCCount = 2;

          const bufferList:Player[] = [];
          
          
          playersList.forEach(
            x => {
              if(x.team === "A"){
                bufferList[teamACount] = x;
                teamACount += totalTeams
              }
              if(x.team === "B"){
                bufferList[teamBCount] = x;
                teamBCount += totalTeams
              }
              if(x.team === "C"){
                bufferList[teamCCount] = x;
                teamCCount += totalTeams
              }
            }
          )


          data.boardState = boardState;
          data.players = bufferList;
          data.drawDeck = gameDeck;
          data.status = true;
          data.noOfCardsPerPlayer = cardsPerPlayer;
          data.turn = bufferList[0].id;
          data.lastTurnTime = new Date().getTime();
        


          await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true});


      
          io.to(roomID).emit(events.roomStateAcknowledgement.name,roomID,data.players,data.totalTeams,data.duration,data.status,false)
          

          

    
  } catch (error:any) {
     // ---- Notifying error ----- //
     socket.emit("userError",error.message)
  }
    
      


}