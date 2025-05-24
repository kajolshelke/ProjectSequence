export const events = {
    roomStateAcknowledgement:{
        name:"roomStateAcknowledgement", description:"Before the game starts, this event sends the roomstate and relevant acknowledgement which includes RoomID,PlayerList,TotalTeams,Duration,Status,DestroyRoomFlag. This event is not triggered by frontend only backend can send this."
    },
    createRoom:{
        name:"createRoom",description:"Room creation by host"
    },
    joinRoom:{
        name:"joinRoom",description:"Room joined by other players"
    },
    roomCheck:{
        name:"roomCheck",description:"To check whether a room exists in db"
    },
    preGameUpdateRoom:{
        name:"preGameUpdateRoom",description:"Includes room lobby settings i.e. total teams, duration and switching of teams"
    },
    preGameLeaveRoom:{
        name:"preGameLeaveRoom",description:"Player other than host leaves the room before game starts"
    },
    preGameDestroyRoom:{
        name:"preGameDestroyRoom",description:"Host leaves the room before game starts"
    },
    gameStart:{
        name:"gameStart",description:"Host starts the game"
    },
    playerFirstHand:{
        name:"playerFirstHand",description:"After the game starts, user is redirected to GamePage, this event requests for player's first hand and backend sends FirstPlayerName,FirstPlayerTeam,FirstPlayerID,HandState,PlayerTeam(one who is viewing the page not necessarily have their turn),DrawDeckLength,Duration"
    },
    playerMove:{
        name:"playerMove",description:"Player makes a move and backened sends back BoardState,SequenceList,NextPlayerName,NextPlayerTeam,NextPlayerID,DrawDeckLength,WinState"
    },
    deadCard:{
        name:"deadCard", description:"Adding dead card to the discard pile"
    },
    playerHandUpdate:{
        name:"playerHandUpdate", description:"Backend sends updated hand to the player who made the move"
    },
    postGameLeaveRoom:{
        name:"postGameLeaveRoom",description:"Destroys the room if any player leaves the room in game"
    }


    
}
