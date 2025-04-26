import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import disconnectController from "../controllers/disconnectController.js";
import dotenv from "dotenv";
import createRoomController from "../controllers/createRoomController.js";
import getRoomStateController from "../controllers/getRoomStateController.js";
import joinRoomController from "../controllers/joinRoomController.js";
import teamSwitchController from "../controllers/teamSwitchController.js";
import lobbySettingsUpdate from "../controllers/lobbySettingsUpdateController.js";
import db from "../db/redisConfig.js";
import destroyRoomController from "../controllers/destroyRoomController.js";
import leaveRoom from "../controllers/controllerLeaveRoom.js";
import { playerHandController } from "../controllers/playerHandController.js";
import { gameStartController } from "../controllers/gameStartController.js";
import { moveController } from "../controllers/moveController.js";

//Initial Configuration 
dotenv.config()
const app = express();
const PORT = 3000;

//Create Server
const server  = createServer(app);

//Server Config
export const io = new Server (server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
}) 


//Routes
io.on("connection",(socket)=>{

    socket.on("createRoom",async (nickname)=>{
        await createRoomController(socket,nickname)
    })

    socket.on("joinRoom", async(nickname,roomID)=>{
        await joinRoomController(socket,nickname,roomID)
    })

    socket.on("teamSwitch",async(team,roomID,id)=>{
        await teamSwitchController(socket,team,roomID,id)
    })

    socket.on("lobbySettingsUpdate", async(roomID,duration,totalTeams,nickname)=>{
        await lobbySettingsUpdate(socket,roomID,duration,totalTeams,nickname)
    })

    socket.on("getRoomState",async(roomID,nickname)=>{
        await getRoomStateController(socket,roomID,nickname)
    })

    socket.on("newGameStarted", async(playerID,roomID)=>{
        await gameStartController(socket,playerID,roomID)
    })

    socket.on("playerHand",async(playerID,roomID)=>{
        await playerHandController(socket,playerID,roomID)
    })
    socket.on("playerMadeMove", async(playerID,roomID,selectedCardFromHand,moveCardOnBoard)=>{
        await moveController(socket,playerID,roomID,selectedCardFromHand,moveCardOnBoard)
    })

    socket.on("roomDestroy", async(roomID,name) => {
        await destroyRoomController(socket, name, roomID);
    })

    socket.on("leaveRoom", (roomID, name) => {
        leaveRoom(socket,roomID,name)
    })

    socket.on("disconnect",()=>{
        disconnectController(socket)
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