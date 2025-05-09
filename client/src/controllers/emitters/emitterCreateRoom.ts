import { events } from "../../events/events";
import socket from "../../socket/socket";

export default function emitterCreateRoom(nickname : string) {
    socket.emit(events.createRoom.name, nickname)
}