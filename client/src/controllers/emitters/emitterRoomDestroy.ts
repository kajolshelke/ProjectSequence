import socket from "../../socket/socket";

export default function emitterRoomDestroy(nickname : string, roomID : string) {
    socket.emit("roomDestroy", roomID, nickname);
}