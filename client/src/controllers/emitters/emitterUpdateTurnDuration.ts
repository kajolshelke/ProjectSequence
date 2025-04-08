import socket from "../../socket/socket";

function emitterUpdateTurnDuration(duration: number, roomID : string | null, totalTeams : number) {
    const id = localStorage.getItem("playerID")
    socket.emit("lobbySettingsUpdate", roomID, duration, totalTeams, id);
}

export default emitterUpdateTurnDuration