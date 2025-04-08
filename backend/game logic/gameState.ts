import { RSDToCoordinate,coordinateToRSD } from "./transformer.js";
import { BoardState,HandStateCard, SequenceCard } from "../types/types.js";



export  function checkMove(selectedCardFromHand:HandStateCard,moveCardOnBoard:HandStateCard,currentBoardState:BoardState[],sequenceCardsList:SequenceCard[][]){

    const chipState = currentBoardState.find(
        card => card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck
    )

    if(!chipState){
        throw new Error("Invalid card");
    }
    
    // if drawn card is blackjack
    if(selectedCardFromHand.rank === 11 && (selectedCardFromHand.suit === "Club" || selectedCardFromHand.suit === "Spade")){

        if(chipState.team === null || chipState.team === selectedCardFromHand.team){
            throw new Error("Invalid move");
        }

        const doesCardBelongToASequence = sequenceCardsList.flat().filter(
            card => card.rank !== moveCardOnBoard.rank && card.suit !== moveCardOnBoard.suit && card.deck !== moveCardOnBoard.deck
        )
        if(doesCardBelongToASequence.length !== 0){
            throw new Error("Invalid move");
        }

        const newBoardState = currentBoardState.forEach(
            card => {
                if(card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck){
                    card.team = null;
                }
            }
        )


        return {newBoardState,sequenceCardsList}

    }else{

        if(chipState.team !== null){
            throw new Error("Invalid move");
        }

        if(!((selectedCardFromHand.rank === 11 && (selectedCardFromHand.suit === "Heart" || selectedCardFromHand.suit === "Diamond"))
        || (selectedCardFromHand.rank === moveCardOnBoard.rank && selectedCardFromHand.suit === moveCardOnBoard.suit && selectedCardFromHand.team === moveCardOnBoard.team))){
            
            throw new Error("Invalid move");
            
        }


        const playerTeam = moveCardOnBoard.team;
        
        
        const newBoardState = currentBoardState.forEach(
            card => {
                if(card.rank === moveCardOnBoard.rank && card.suit === moveCardOnBoard.suit && card.deck === moveCardOnBoard.deck){
                    card.team = playerTeam;
                }
            }
        )

        
        const currentCoordinate = RSDToCoordinate(moveCardOnBoard.rank,moveCardOnBoard.suit,moveCardOnBoard.deck);
        if(!currentCoordinate) return false;

        const {i,j} = currentCoordinate;

        const bounds = {
            iMin:0,
            jMin:0,
            iMax:9,
            jMax:9
        }

        

        const direction_delta = [
            [[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4]],
            [[-4,-4],[-3,-3],[-2,-2],[-1,-1],[0,0],[1,1],[2,2],[3,3],[4,4]],
            [[-4,0],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],[4,0]],
            [[-4,4],[-3,3],[-2,2],[-1,1],[0,0],[1,-1],[2,-2],[3,-3],[4,-4]]
        ]

        let bufferList:SequenceCard[] = [];
        let continuityCount:number = 0;

         
        
        for (let d = 0; d < direction_delta.length;d++){
            
            for(const [di,dj] of direction_delta[d]){

                let new_i = i + di;
                let new_j = j + dj;

                if(new_i > bounds.iMax || new_i < bounds.iMin || new_j > bounds.jMax || new_j < bounds.jMin){
                    continue
                }
                
                


                    const currentCard = coordinateToRSD(new_i,new_j);

                    

                    if(currentCard){


                        if(new_i === 0 && new_j === 0 || new_i === 0 && new_j === 9 || new_i === 9 && new_j === 0 ||new_i === 9 && new_j === 9){


                            continuityCount += 1;
                            bufferList.push(currentCard)

                        }else{

                            const teamCheck = currentBoardState.filter((card)=> 
                                card.rank === currentCard.rank && card.suit === currentCard.suit && card.deck === currentCard.deck
                            )[0].team
                            
        
                            if(teamCheck === playerTeam){
                                    bufferList.push(currentCard);
                                    continuityCount += 1;  
                            }else{
                                continuityCount = 0;
                            }
        

                        }
                
                        

                        if(continuityCount >= 5){
                            sequenceCardsList.push(bufferList);
                            continuityCount = 1;
                            bufferList = [currentCard]
                        }


                    }

                
            }
            
            bufferList = [];
            continuityCount = 0;
        }

        return{newBoardState,sequenceCardsList}
    }


}

function handCardValidator(handState:HandStateCard[],drawnCard:HandStateCard){
    const handCheck = handState.filter(
        card => card.rank === drawnCard.rank && card.suit === drawnCard.suit && card.deck === drawnCard.deck
    )

    if(handCheck.length === 1){
        console.log("valid move");
    }else{
        throw new Error("invalid move");
    }
}


