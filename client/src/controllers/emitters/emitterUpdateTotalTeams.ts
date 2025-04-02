import socket from "../../socket/socket";

function emitterUpdateTotalTeams(duration: number, roomID : string, totalTeams : number, nickname : string) {
    socket.emit("lobbySettingsUpdate", roomID, duration, totalTeams, nickname);
  }

export default emitterUpdateTotalTeams