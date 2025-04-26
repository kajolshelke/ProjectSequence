import socket from "../../socket/socket";

function emitterJoinRoom( nickname : string,roomID : string | null) {
    socket.emit("joinRoom",nickname,roomID );
  }


export default emitterJoinRoom