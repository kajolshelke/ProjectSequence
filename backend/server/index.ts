import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import createRoomController from "../controllers/createRoomController.js";
import joinRoomController from "../controllers/joinRoomController.js";
import db from "../db/redisConfig.js";
import destroyRoomController from "../controllers/destroyRoomController.js";
import { playerHandController } from "../controllers/playerHandController.js";
import { gameStartController } from "../controllers/gameStartController.js";
import { moveController } from "../controllers/moveController.js";
import { events } from "../events/events.js";
import leaveRoomController from "../controllers/leaveRoomController.js";
import lobbySettingsUpdateController from "../controllers/lobbySettingsUpdateController.js";
import deadCardController from "../controllers/deadCardController.js";
import postGameLeaveRoomController from "../controllers/postGameLeaveRoomController.js";
import doesRoomExistController from "../controllers/doesRoomExistController.js";

//Initial Configuration 
dotenv.config()
const app = express();
const PORT = 3000;

//Create Server
const server  = createServer(app);

//Server Config
export const io = new Server (server,{
    path:"/ws",
}) 


//Routes
io.on("connection",(socket)=>{

    socket.on(events.createRoom.name,async (nickname)=>{
        await createRoomController(socket,nickname)
    })

    socket.on(events.roomCheck.name, async(roomIDFromURL)=>{
        await doesRoomExistController(socket,roomIDFromURL)
    })
    socket.on(events.joinRoom.name, async(nickname,roomID)=>{
        await joinRoomController(socket,nickname,roomID)
    })

    socket.on(events.preGameUpdateRoom.name, async(roomID,duration,totalTeams,playerID,team)=>{
        await lobbySettingsUpdateController(socket,roomID,duration,totalTeams,playerID,team)
    })


    socket.on(events.gameStart.name, async(playerID,roomID)=>{
        await gameStartController(socket,playerID,roomID)
    })

    socket.on(events.playerFirstHand.name,async(playerID,roomID)=>{
        await playerHandController(socket,playerID,roomID)
    })
    socket.on(events.playerMove.name, async(playerID,roomID,selectedCardFromHand,moveCardOnBoard)=>{
        await moveController(socket,playerID,roomID,selectedCardFromHand,moveCardOnBoard)
    })
    socket.on(events.deadCard.name, async(playerID,roomID,selectedCardFromHand)=>{
        await deadCardController(socket,playerID,roomID,selectedCardFromHand)
    })

    socket.on(events.preGameDestroyRoom.name, async(roomID,playerID) => {
        await destroyRoomController(socket,roomID,playerID);
    })

    socket.on(events.preGameLeaveRoom.name, (roomID,playerID) => {
        leaveRoomController(socket,roomID,playerID)
    })

    socket.on(events.postGameLeaveRoom.name,async(roomID,playerID)=>{
        await postGameLeaveRoomController(socket,roomID,playerID)
    })

    


})


server.on("close",()=>{
    console.log("Server is closed")
})


server.on("error",(error)=>{
    console.log(error.message)
})


server.on("clientError",(error)=>{
    console.log(error.message)
})

server.on("close",()=>{
    db.disconnect().then(()=>{
        console.log("Database is disconnected")
        console.log("Server closed")
    });
})



server.listen(PORT,()=>{
    db.connect();
    console.log(`Server listening on port ${PORT}`)
})