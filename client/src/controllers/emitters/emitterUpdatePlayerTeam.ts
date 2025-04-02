import socket from "../../socket/socket";

function emitterUpdatePlayerTeam(roomID : string, team : string, nickname : string) {
    socket.emit("teamSwitch", team, roomID, nickname);
  }

export default emitterUpdatePlayerTeam