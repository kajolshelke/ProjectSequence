type Player = {
    name:string,
    team:"A"| "B" | "C",
    time:number|null,
    hand:string[]|null,
    host:boolean
}



type Room = {
    players:Player[],
    totalTeams: 2|3,
    status:boolean,
    turn:string,
    duration:120000|300000,
    teamASequenceCount:0|1|2|3,
    teamBSequenceCount:0|1|2|3,
    teamCSequenceCount:0|1|2|3,
    drawDeck:string[],
    gameState:string[]

}

type CardInfo ={
    i:number,
    j:number,
    rank:number,
    suit:"Joker"|"Spade"|"Heart"|"Diamond"|"Club",
    deck:0 | 1 | null

}

type BoardState = {
    rank:number,
    suit:"Joker"|"Spade"|"Heart"|"Diamond"|"Club",
    deck:0 | 1 | null,
    team: "A"|"B"|"C"|null
}

type SequenceCard = {
    rank:number,
    suit:"Joker"|"Spade"|"Heart"|"Diamond"|"Club",
    deck:0 | 1 | null,
}

type HandStateCard = {
    rank:number,
    suit:"Joker"|"Spade"|"Heart"|"Diamond"|"Club",
    deck:0 | 1 | null,
    team:"A"|"B"|"C"|null
}


export type {Player,Room,CardInfo,BoardState,SequenceCard,HandStateCard}