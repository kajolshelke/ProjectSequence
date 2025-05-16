import { z } from "zod";
import { BoardState, HandStateCard, MoveCardOnBoard, Room, SelectedCardFromHand, SequenceCard } from "../types/types.js";
import { cardValidationSchema, playerValidationSchema, roomIDValidationSchema } from "../validation/validationSchema.js";
import db from "../db/redisConfig.js";
import { coordinateToRSD, RSDToCoordinate } from "../game logic/transformer.js";
import { Socket } from "socket.io";
import { io } from "../server/index.js";
import { events } from "../events/events.js";

export async function moveController(socket:Socket,playerID:string,roomID:string,selectedCardFromHand:SelectedCardFromHand,moveCardOnBoard:MoveCardOnBoard){


    try {
        const selectedCardFromHandValidation = z.object({
            rank: cardValidationSchema.shape.rank,
            suit:cardValidationSchema.shape.suit
        })

        const validationSchema = z.object({
            playerID:playerValidationSchema.shape.id,
            roomID:roomIDValidationSchema,
            selectedCardFromHand:selectedCardFromHandValidation.nullable(),
            moveCardOnBoard:cardValidationSchema.nullable()
        })

        const validationResult = validationSchema.safeParse({playerID,roomID,selectedCardFromHand,moveCardOnBoard})

        
        if (!validationResult.success) {
            throw new Error(validationResult.error.errors[0].message);
        }

        if(selectedCardFromHand === null && moveCardOnBoard !== null){
            throw new Error("Invalid move");
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


         // --- Extra time added to each move taking into account the delay for req transmission ---//
         const graceTime = 500;


         

         // --- Switching the turn to next player when timer runs out for a player ---//
         if(((data.lastTurnTime! + data.duration + graceTime) < new Date().getTime()) || (selectedCardFromHand === null && moveCardOnBoard === null)){
 
             // ----Incrementing turn of player ---- //
             let nextPlayerIndex = 0;
 
             // --- Changing turn to next player in the list when timer elapses --- //
             data.players.forEach((x,i) => {
             if(x.id === playerID){
                 nextPlayerIndex = i + 1
                 nextPlayerIndex = nextPlayerIndex % (data.players.length)
             }
             });
 
             const nextPlayer = data.players[nextPlayerIndex];
             data.turn = nextPlayer.id;
 
            
                //  --- Updating timer for new turn --- //
                data.lastTurnTime = new Date().getTime();
    
             //  ----- Updating the database with these changes ----- //
 
                await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})
        
                io.to(roomID).emit(events.playerMove.name,data.boardState,data.sequenceCardsList,nextPlayer.id,nextPlayer.name,nextPlayer.team,data.drawDeck!.length,data.duration,null,null);
        
                socket.emit(events.playerHandUpdate.name,player[0].hand);
            
             
         }else{


             // ---- Extracting the team of the player who made the move ---//
                const playerTeam = player[0].team;
                

                // ----------Checking whether the move is made by the right player----------//
                if(playerID !== data.turn){
                    throw new Error(`Not your turn ${player[0].name}`)
                }

                // -------Checking whether the selected card from hand actually belongs to the player hand-----//
                const playerHandCheck = player[0].hand!.filter(
                    card => card.rank === selectedCardFromHand.rank && card.suit === selectedCardFromHand.suit
                )

                // --- Checking whether lentgh of filtered array is not zero since there can be two same cards in the hand --- // 
                if(playerHandCheck.length === 0){
                    throw new Error("Invalid move");
                }

                // -------- Getting the value of chip for move card on board from boardstate(db)-------//
                const chipState = data.boardState.filter(
                    card => card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck
                )[0]


                let newBoardState:BoardState[] = data.boardState;
                let sequenceList:SequenceCard[][] = data.sequenceCardsList;
                let playerTeamSequenceCount = data[`team${playerTeam}SequenceCount`]
                

                // ---Removing chip from board card via black jack---//
                //-------- Checking if selected card from hand is BLACK JACK-----//
                if(selectedCardFromHand.rank === 11 && (selectedCardFromHand.suit === "Club" || selectedCardFromHand.suit === "Spade")){
                    
                    // ------Checking whether a chip exists already on the move card
                    // or whether the player that made the move isn't removing their own team chip--------//
                    if(chipState.team === null || chipState.team === playerTeam){
                        throw new Error("Invalid move");
                    }

                    // --------Checking whether the request to remove chip from board card exists in a pre formed sequence------//
                    const doesCardBelongToASequence = data.sequenceCardsList.flat().filter(
                        card => card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck
                    )
                    if(doesCardBelongToASequence.length !== 0){
                        throw new Error("Invalid move");
                    }


                    // ---- Removing the chip from the card on board----//
                    newBoardState.forEach(
                        card => {
                            if(card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck){
                                card.team = null;
                            }
                        }
                    )

                }else{

                    // ---------Placing chip on board via red jack or normal card move------//

                    // ----Checking whether the board card is empty to place a chip----//
                    if(chipState.team !== null){
                        throw new Error("Invalid move");
                    }

                    // ----Checking whether selected card from hand is RED JACK or normal card---- //
                    if(selectedCardFromHand.rank === 11 && (selectedCardFromHand.suit === "Heart" || selectedCardFromHand.suit === "Diamond")){
                        // ---- Placing the chip on the card on board----//
                        newBoardState.forEach(
                            card => {
                                if(card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck){
                                    card.team = playerTeam;
                                }
                            }
                        )
                    }else{
                        // -------Checking whether the selected card from hand and move card on board are same in the case of normal card move----//
                        if(!(selectedCardFromHand.rank === moveCardOnBoard.rank && selectedCardFromHand.suit === moveCardOnBoard.suit)){
                            throw new Error("Invalid move")
                        }

                        // ---- Placing the chip on the card on board----//
                        newBoardState.forEach(
                            card => {
                                if(card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck){
                                    card.team = playerTeam;
                                }
                            }
                        )

                    }

                }

                // ---- Converting the move card on deck to coordinate to check for sequences ---- //
                const currentCoordinate = RSDToCoordinate(moveCardOnBoard.rank,moveCardOnBoard.suit,moveCardOnBoard.deck);

                // ---Redundant check but TS will throw an error if not done--- //
                if(!currentCoordinate){
                    throw new Error("Invalid move")
                }

                const {i,j} = currentCoordinate;

                // --- Defining limits for board length to search for sequences --- //
                const bounds = {
                    iMin:0,
                    jMin:0,
                    iMax:9,
                    jMax:9
                }

                // ---- Defining directions with reference to move made on board in order to check for sequences --- //
                const direction_delta = [
                    [[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4]],
                    [[-4,-4],[-3,-3],[-2,-2],[-1,-1],[0,0],[1,1],[2,2],[3,3],[4,4]],
                    [[-4,0],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0]],
                    [[-4,4],[-3,3],[-2,2],[-1,1],[0,0],[1,-1],[2,-2],[3,-3],[4,-4]]
                ]


                // ---- Initiating empty list for recording sequence and continuity count ---- //
                let bufferList:SequenceCard[] = [];
                let continuityCount:number = 0;



                // ---- Algorithm for checking sequences on game board ---- //

                // --- Starting the check in one direction --- //
                for (let d = 0; d < direction_delta.length;d++){

                    let sequenceEncounter = 0;

                            
                // --- Incrementing the check coordinate by 1 unit in the same direction ---//
                    for(const [di,dj] of direction_delta[d]){

                        let new_i = i + di;
                        let new_j = j + dj;


                        // ---- Checking whether the new coordinate is within the bounds ---- //
                        if(new_i > bounds.iMax || new_i < bounds.iMin || new_j > bounds.jMax || new_j < bounds.jMin){
                            continue
                        }
                        
                        

                            // --- Converting the new coordinate to rank,suit,deck to extract the card --- // 
                            const currentCard = coordinateToRSD(new_i,new_j);

                            
                            if(currentCard){

                                // ---- Checking whether the current card is a joker/border card which ultimately adds 1 to continuity count --- //
                                if(new_i === 0 && new_j === 0 || new_i === 0 && new_j === 9 || new_i === 9 && new_j === 0 ||new_i === 9 && new_j === 9){
                                        bufferList.push(currentCard);
                                        continuityCount += 1;
                                }else{

                                    // --- Checking whether the current card has the same team chip as the one of the player playing the move --- //
                                    const teamCheck = data.boardState.filter((card)=> 
                                        card.rank === currentCard.rank && card.suit === currentCard.suit && card.deck === currentCard.deck
                                    )[0].team
                                    
                                    // ---- If the current card has same team chip, incrementing the card into the list of sequences --- //
                                    if(teamCheck === playerTeam){

                                       const cardBelongsToSequence = data.sequenceCardsList.flat().filter(
                                            x => x.rank === currentCard.rank && x.suit === currentCard.suit && x.deck === currentCard.deck
                                        ).length !== 0

                                        
                                        if(cardBelongsToSequence ){
                                            if(sequenceEncounter === 0){
                                                sequenceEncounter = 1;
                                                bufferList.push(currentCard);
                                                continuityCount += 1;
                                            }
                                            

                                        }else{
                                            bufferList.push(currentCard);
                                            continuityCount += 1;

                                        }

                                                                            
                                              
                                    }else{
                                        // --- Making the count 0 and aborting to check in that direction and changing to next direction
                                        continuityCount = 0;
                                        bufferList=[];
                                        sequenceEncounter = 0;
            
                                    }
                

                                }
                        
                                
                                // --- Pushing the card in sequence list if the count is greater than 5 and increasing player team sequence count----//
                                if(continuityCount >= 5){
                                    sequenceList.push(bufferList);
                                    playerTeamSequenceCount += 1;
                                    sequenceEncounter = 0;
                                    continuityCount = 1;
                                    bufferList = [currentCard]
                                }


                            }

                        
                    }
                    
                    // ---Making the buffer list empty and count 0 after completion of one direction --- //
                    bufferList = [];
                    continuityCount = 0;
                    sequenceEncounter = 0;
                }


                data.boardState = newBoardState;
                data.sequenceCardsList = sequenceList;

                if(playerTeam === "A"){
                    data.teamASequenceCount = playerTeamSequenceCount;
                }
                if(playerTeam === "B"){
                    data.teamBSequenceCount = playerTeamSequenceCount;
                }
                if(playerTeam === "C"){
                    data.teamCSequenceCount = playerTeamSequenceCount;
                }



                console.log(data.sequenceCardsList);


                // ----  Updating the hand of player by drawing a card from deck ---- //

                const currentPlayerHand = player[0].hand;
            

                // ---- Finding the used card from hand to be removed --- // 
                const selectedCardFromHandIndex = currentPlayerHand!.findIndex(
                    card => card.rank === selectedCardFromHand.rank && card.suit === selectedCardFromHand.suit
                )

                // --- If matching index not found findIndex returns -1 --- //
                if(selectedCardFromHandIndex === -1){
                    throw new Error("Invalid move");
                }


                
                const playerHandAfterMove = currentPlayerHand;
            
                // ----- Checking if the deck has cards to draw ---- //
                if(data.drawDeck!.length < 1){
                    throw new Error("No more cards in deck to draw")
                }
                // --- Adding card from deck to player hand --- //
                const newCard = data.drawDeck!.splice(0,1)[0];
                playerHandAfterMove![selectedCardFromHandIndex] = newCard;
                


                // ----Incrementing turn of player ---- //
                let nextPlayerIndex = 0;

                // ---- Updating player hand in db --- //
                data.players.forEach((x,i) => {
                if(x.id === playerID){
                    x.hand = playerHandAfterMove;
                    nextPlayerIndex = i + 1
                    nextPlayerIndex = nextPlayerIndex % (data.players.length)
                }
                });

                const nextPlayer = data.players[nextPlayerIndex];
                data.turn = nextPlayer.id;
                



                //  --- Updating timer for new turn --- //
                data.lastTurnTime = new Date().getTime();


                let winState = null;
                if(data.totalTeams === 2){
                    if(data.teamASequenceCount >= 2){
                        winState = "A";
                    }
                    if(data.teamBSequenceCount >= 2){
                        winState = "B"
                    }
                }else{
                    if(data.teamASequenceCount >= 1){
                        winState = "A";
                    }
                    if(data.teamBSequenceCount >= 1){
                        winState = "B"
                    }
                    if(data.teamCSequenceCount >= 1){
                        winState = "C";
                    }
                    
                }
                console.log(winState,data.teamASequenceCount,data.teamBSequenceCount);

                //  ----- Updating the database with these changes ----- //

                await db.set(roomID,JSON.stringify(data),{KEEPTTL:true,XX:true})

                if(winState !== null){
                  await db.DEL(roomID);
                }

                io.to(roomID).emit(events.playerMove.name,newBoardState,sequenceList,nextPlayer.id,nextPlayer.name,nextPlayer.team,data.drawDeck!.length,data.duration,winState,moveCardOnBoard);

                socket.emit(events.playerHandUpdate.name,playerHandAfterMove);
    


         }
        
       
    } catch (error:any) {

         // ---- Notifying error ----- //
         console.log(error)
         socket.emit("userError",error.message)

        
    }
}