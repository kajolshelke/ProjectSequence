import socket from "../../socket/socket";

function emitterJoinRoom(roomID : string | null, nickname : string) {
    socket.emit("joinRoom", { roomID, nickname });
  }


export default emitterJoinRoom