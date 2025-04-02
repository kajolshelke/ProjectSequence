import socket from "../../socket/socket";

function emitterJoinRoom(roomID : string, nickname : string) {
    socket.emit("joinRoom", { roomID, nickname });
  }


export default emitterJoinRoom