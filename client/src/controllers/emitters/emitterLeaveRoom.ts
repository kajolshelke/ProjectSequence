import { events } from "../../events/events";
import socket from "../../socket/socket";

function emitterLeaveRoom(roomID : string, playerID : string) {
    socket.emit(events.preGameLeaveRoom.name, roomID, playerID );
  }


export default emitterLeaveRoom