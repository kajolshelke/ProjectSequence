import socket from "../../socket/socket";

export default function emitterRoomDestroy(roomID : string | null) {
    const id = localStorage.getItem("playerID")
    socket.emit("roomDestroy", roomID, id);
}