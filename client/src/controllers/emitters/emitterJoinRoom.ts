import { events } from "../../events/events";
import socket from "../../socket/socket";

function emitterJoinRoom( nickname : string,roomID : string | null) {
    socket.emit(events.joinRoom.name,nickname,roomID );
  }


export default emitterJoinRoom