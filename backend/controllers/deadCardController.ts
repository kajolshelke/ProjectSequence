import { Socket } from "socket.io";
import { Room, SelectedCardFromHand } from "../types/types.js";
import { cardValidationSchema, playerValidationSchema, roomIDValidationSchema } from "../validation/validationSchema.js";
import { z } from "zod";
import db from "../db/redisConfig.js";
import { events } from "../events/events.js";

export default async function deadCardController(socket:Socket,playerID:string,roomID:string,selectedCardFromHand:SelectedCardFromHand) {
    


    try {

        if(selectedCardFromHand === null){
            throw new Error("Invalid move")
        }
        const selectedCardFromHandValidation = z.object({
                    rank: cardValidationSchema.shape.rank,
                    suit:cardValidationSchema.shape.suit
                })

        const validationSchema = z.object({
            playerID:playerValidationSchema.shape.id,
            roomID:roomIDValidationSchema,
            selectedCardFromHand:selectedCardFromHandValidation
        })

        const validationResult = validationSchema.safeParse({playerID,roomID,selectedCardFromHand})

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

        const player = data.players.filter(x => x.id === playerID);

        if(player.length !== 1){
            throw new Error("Player doesn't exist")
        }

         // ----------Checking whether the move is made by the right player----------//
         if(playerID !== data.turn){
            throw new Error(`Not your turn ${player[0].name}`)
        }

        // ---- Checking whether the selected card from hand belongs to player hand ---- //

        if(player[0].hand!.filter(
            x => (x.rank === selectedCardFromHand.rank && x.suit === selectedCardFromHand.suit)
        ).length === 0){
            throw new Error("Invalid move")
        }

        // --- To check whether the selected card from hand has chips placed at both places on the gameboard ---//
        let deadCard = false;

        const deadCardsOnBoard = data.boardState.filter(
            x => x.rank === selectedCardFromHand.rank && x.suit === selectedCardFromHand.suit
        )

        if(deadCardsOnBoard.length !== 2){
            throw new Error("Invalid move")
        }
            
        deadCard = deadCardsOnBoard.every(x => x.team !== null)

        if(!deadCard){
            throw new Error("Invalid move")
        }

        // --- Finding the card to be removed from hand --- //
        const selectedCardFromHandIndex = player[0].hand!.findIndex(
            x => x.rank === selectedCardFromHand.rank && x.suit === selectedCardFromHand.suit
        )

        // -- NO need to check for -1 value returned since already checked whether the card belongs to hand --- //


        const playerHandAfterMove = player[0].hand

        // ----- Checking if the deck has cards to draw ---- //
        if(data.drawDeck!.length < 1){
            throw new Error("No more cards in deck to draw")
        }
        // --- Adding card from deck to player hand --- //
        const newCard = data.drawDeck!.splice(0,1)[0];
        playerHandAfterMove![selectedCardFromHandIndex] = newCard;


         //  ----- Updating the database with these changes ----- //

         await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})

         socket.emit(events.playerHandUpdate.name,playerHandAfterMove);



    } catch (error:any) {
        // ---- Notifying error ----- //
        
        socket.emit("userError",error.message)

    }
}