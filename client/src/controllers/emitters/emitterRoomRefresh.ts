import socket from "../../socket/socket";

export default function emitterRoomRefresh(nickname : string, roomID : string) {
    socket.emit("getRoomState",roomID, nickname);
}