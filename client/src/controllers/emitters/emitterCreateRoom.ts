import socket from "../../socket/socket";

export default function emitterCreateRoom(nickname : string) {
    socket.emit("createRoom", nickname)
}