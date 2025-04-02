import socket from "../../socket/socket";

function emitterUpdateTurnDuration(duration: number, roomID : string, totalTeams : number, nickname : string) {
    socket.emit("lobbySettingsUpdate", roomID, duration, totalTeams, nickname);
}

export default emitterUpdateTurnDuration