import { CardInfo } from "../types/types.js";

const boardPattern: CardInfo[] = [
    { i:0,j:0,rank: 0, suit: "Joker",deck:null },
    { i:0,j:1,rank: 10, suit: "Spade",deck:0 },
    { i:0,j:2,rank: 12, suit: "Spade",deck:0 },
    { i:0,j:3,rank: 13, suit: "Spade",deck:0 },
    { i:0,j:4,rank: 1, suit: "Spade",deck:0 },
    { i:0,j:5,rank: 2, suit: "Diamond",deck:0 },
    { i:0,j:6,rank: 3, suit: "Diamond",deck:0 },
    { i:0,j:7,rank: 4, suit: "Diamond",deck:0 },
    { i:0,j:8,rank: 5, suit: "Diamond",deck:0 },
    { i:0,j:9,rank: 1, suit: "Joker",deck:null },
    { i:1,j:0,rank: 9, suit: "Spade",deck:0 },
    { i:1,j:1,rank: 10, suit: "Heart",deck:0 },
    { i:1,j:2,rank: 9, suit: "Heart",deck:0 },
    { i:1,j:3,rank: 8, suit: "Heart",deck:0 },
    { i:1,j:4,rank: 7, suit: "Heart",deck:0 },
    { i:1,j:5,rank: 6, suit: "Heart",deck:0 },
    { i:1,j:6,rank: 5, suit: "Heart",deck:0 },
    { i:1,j:7,rank: 4, suit: "Heart",deck:0 },
    { i:1,j:8,rank: 3, suit: "Heart",deck:0 },
    { i:1,j:9,rank: 6, suit: "Diamond",deck:0 },
    { i:2,j:0,rank: 8, suit: "Spade",deck:0 },
    { i:2,j:1,rank: 12, suit: "Heart",deck:0 },
    { i:2,j:2,rank: 7, suit: "Diamond",deck:1 },
    { i:2,j:3,rank: 8, suit: "Diamond",deck:1 },
    { i:2,j:4,rank: 9, suit: "Diamond",deck:1 },
    { i:2,j:5,rank: 10, suit: "Diamond",deck:1 },
    { i:2,j:6,rank: 12, suit: "Diamond",deck:1 },
    { i:2,j:7,rank: 13, suit: "Diamond",deck:1 },
    { i:2,j:8,rank: 2, suit: "Heart",deck:0 },
    { i:2,j:9,rank: 7, suit: "Diamond",deck:0 },
    { i:3,j:0,rank: 7, suit: "Spade",deck:0 },
    { i:3,j:1,rank: 13, suit: "Heart",deck:0 },
    { i:3,j:2,rank: 6, suit: "Diamond",deck:1 },
    { i:3,j:3,rank: 2, suit: "Club",deck:1 },
    { i:3,j:4,rank: 1, suit: "Heart",deck:1 },
    { i:3,j:5,rank: 13, suit: "Heart",deck:1 },
    { i:3,j:6,rank: 12, suit: "Heart",deck:1 },
    { i:3,j:7,rank: 1, suit: "Diamond",deck:1 },
    { i:3,j:8,rank: 2, suit: "Spade",deck:1 },
    { i:3,j:9,rank: 8, suit: "Diamond",deck:0 },
    { i:4,j:0,rank: 6, suit: "Spade",deck:0 },
    { i:4,j:1,rank: 1, suit: "Heart",deck:0 },
    { i:4,j:2,rank: 5, suit: "Diamond",deck:1 },
    { i:4,j:3,rank: 3, suit: "Club",deck:1 },
    { i:4,j:4,rank: 4, suit: "Heart",deck:1 },
    { i:4,j:5,rank: 3, suit: "Heart",deck:1 },
    { i:4,j:6,rank: 10, suit: "Heart",deck:1 },
    { i:4,j:7,rank: 1, suit: "Club",deck:1 },
    { i:4,j:8,rank: 3, suit: "Spade",deck:1 },
    { i:4,j:9,rank: 9, suit: "Diamond",deck:0 },
    { i:5,j:0,rank: 5, suit: "Spade",deck:0 },
    { i:5,j:1,rank: 2, suit: "Club",deck:0 },
    { i:5,j:2,rank: 4, suit: "Diamond",deck:1 },
    { i:5,j:3,rank: 4, suit: "Club",deck:1 },
    { i:5,j:4,rank: 5, suit: "Heart",deck:1 },
    { i:5,j:5,rank: 2, suit: "Heart",deck:1 },
    { i:5,j:6,rank: 9, suit: "Heart",deck:1 },
    { i:5,j:7,rank: 13, suit: "Club",deck:1 },
    { i:5,j:8,rank: 4, suit: "Spade",deck:1 },
    { i:5,j:9,rank: 10, suit: "Diamond",deck:0 },
    { i:6,j:0,rank: 4, suit: "Spade",deck:0 },
    { i:6,j:1,rank: 3, suit: "Club",deck:0 },
    { i:6,j:2,rank: 3, suit: "Diamond",deck:1 },
    { i:6,j:3,rank: 5, suit: "Club",deck:1 },
    { i:6,j:4,rank: 6, suit: "Heart",deck:1 },
    { i:6,j:5,rank: 7, suit: "Heart",deck:1 },
    { i:6,j:6,rank: 8, suit: "Heart",deck:1 },
    { i:6,j:7,rank: 12, suit: "Club",deck:1 },
    { i:6,j:8,rank: 5, suit: "Spade",deck:1 },
    { i:6,j:9,rank: 12, suit: "Diamond",deck:0 },
    { i:7,j:0,rank: 3, suit: "Spade",deck:0 },
    { i:7,j:1,rank: 4, suit: "Club",deck:0 },
    { i:7,j:2,rank: 2, suit: "Diamond",deck:1 },
    { i:7,j:3,rank: 6, suit: "Club",deck:1 },
    { i:7,j:4,rank: 7, suit: "Club",deck:1 },
    { i:7,j:5,rank: 8, suit: "Club",deck:1 },
    { i:7,j:6,rank: 9, suit: "Club",deck:1 },
    { i:7,j:7,rank: 10, suit: "Club",deck:1 },
    { i:7,j:8,rank: 6, suit: "Spade",deck:1 },
    { i:7,j:9,rank: 13, suit: "Diamond",deck:0 },
    { i:8,j:0,rank: 2, suit: "Spade",deck:0 },
    { i:8,j:1,rank: 5, suit: "Club",deck:0 },
    { i:8,j:2,rank: 1, suit: "Spade",deck:1 },
    { i:8,j:3,rank: 13, suit: "Spade",deck:1 },
    { i:8,j:4,rank: 12, suit: "Spade",deck:1 },
    { i:8,j:5,rank: 10, suit: "Spade",deck:1 },
    { i:8,j:6,rank: 9, suit: "Spade",deck:1 },
    { i:8,j:7,rank: 8, suit: "Spade",deck:1 },
    { i:8,j:8,rank: 7, suit: "Spade",deck:1 },
    { i:8,j:9,rank: 1, suit: "Diamond",deck:0 },
    { i:9,j:0,rank: 2, suit: "Joker",deck:null },
    { i:9,j:1,rank: 6, suit: "Club",deck:0 },
    { i:9,j:2,rank: 7, suit: "Club",deck:0 },
    { i:9,j:3,rank: 8, suit: "Club",deck:0 },
    { i:9,j:4,rank: 9, suit: "Club",deck:0 },
    { i:9,j:5,rank: 10, suit: "Club",deck:0 },
    { i:9,j:6,rank: 12, suit: "Club",deck:0 },
    { i:9,j:7,rank: 13, suit: "Club",deck:0 },
    { i:9,j:8,rank: 1, suit: "Club",deck:0 },
    { i:9,j:9,rank: 3, suit: "Joker",deck:null },
] as const;


export function coordinateToRSD(i:number,j:number){
    const card = boardPattern.find(card => card.i === i && card.j === j)

    if(card){
        return {rank:card.rank,suit:card.suit,deck:card.deck}
    }else{
        return undefined
    }
}

export function RSDToCoordinate(rank:number,suit:"Heart"|"Spade"|"Club"|"Diamond"|"Joker",deck:0|1|null){
    const coordinate = boardPattern.find(card => card.rank === rank && card.suit === suit && card.deck === deck)

    if(coordinate){
        return {i:coordinate.i,j:coordinate.j}
    }else{
        return undefined
    }
}
