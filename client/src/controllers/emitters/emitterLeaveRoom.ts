import socket from "../../socket/socket";

function emitterLeaveRoom(roomID : string, nickname : string) {
    socket.emit("leaveRoom", roomID, nickname );
  }


export default emitterLeaveRoom