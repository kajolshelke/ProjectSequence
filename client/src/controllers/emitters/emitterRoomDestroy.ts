import { events } from "../../events/events";
import socket from "../../socket/socket";

export default function emitterRoomDestroy(roomID : string | null) {
    const playerID = localStorage.getItem("playerID")
    socket.emit(events.preGameDestroyRoom.name, roomID, playerID);
}