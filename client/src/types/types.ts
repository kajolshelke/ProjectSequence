type Player = {
    name:string,
    id:string,
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



export type {Player,Room}