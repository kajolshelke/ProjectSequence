import socket from "../../socket/socket";

function emitterUpdatePlayerTeam(roomID : string | null, team : string) {
    const id = localStorage.getItem("playerID")
    console.log(id);
    socket.emit("teamSwitch", team, roomID, id);
  }

export default emitterUpdatePlayerTeam