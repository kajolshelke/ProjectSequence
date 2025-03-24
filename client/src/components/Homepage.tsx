import { IoPeople } from "react-icons/io5";
import { IoMdCreate } from "react-icons/io";
import { useEffect, useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

const Homepage = () => {
  const [nickname, setNickname] = useState("");
  const [createRoom, setCreateRoom] = useState(false);
  const [roomID, setRoomID] = useState<string>("");
  const [joinRoom, setJoinRoom] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const roomIDFromURL = params.get("roomID");

  function handleCreateRoom() {
    if (!nickname) return;
    // emitting create room event to server
    socket.emit("createRoom", { nickname });
  }

  function handleJoinRoom() {
    setJoinRoom(true);
    socket.emit("joinRoom", { roomID: roomIDFromURL, nickname });
  }
  // listening for roomCreated event from server
  useEffect(() => {
    socket.on("roomCreated", ({ roomID }) => {
      setRoomID(roomID);
      setCreateRoom(true);
    });

    return () => {
      socket.off("roomCreated");
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-b to-white from-blue-300 ">
      <div className="animate-scaleUp">
        <div className=" p-4 text-center pt-20 ">
          <h1
            className={`p-2 tracking-widest text-5xl 
                      font-bold text-blue-950 inline-block
                       max-w-max overflow-hidden whitespace-normal
                       w-0 border-r-2 border-r-solid border-r-blue-950
                       animate-[var(--animate-typing),var(--animate-removeCursor)] `}
          >
            SEQUENCE
          </h1>
          <h3 className="text-xl mt-1 text-blue-900">
            Connect the cards and claim the board!
          </h3>
        </div>

        <div className="text-center mt-12 mb-28 flex flex-col m-auto  w-max">
          <label htmlFor="nickname" className="text-blue-800/70 mt-2 mb-1">
            Enter your nickname
          </label>
          <input
            id="nickname"
            type="text"
            className={`outline-none border-none rounded-md px-4 py-2 text-blue-950/80 font-medium text-center
                    bg-blue-50 shadow-lg`}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="w-max mt-12 mb-12 p-2 flex flex-col gap-4 m-auto">
          {!roomIDFromURL && (
            <div className="w-full  text-white mr-10">
              <button
                className={`px-2 py-1.5 outline-none font-medium rounded-md transition-all
                        w-full bg-gradient-to-br from-blue-900 to-blue-500 cursor-pointer 
                        hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-400
                        flex items-center justify-center gap-2`}
                onClick={handleCreateRoom}
                disabled={!nickname}
              >
                <IoMdCreate className="text-lg " />
                Create Room
              </button>
              <CreateRoomModal
                nickname={nickname}
                createRoom={createRoom}
                roomID={roomID}
                onClose={() => setCreateRoom(false)}
                socket={socket}
              />
            </div>
          )}
          <div className="w-full text-white mr-10">
            <button
              className={`px-2 py-1.5 outline-none font-medium rounded-md transition-all
                        w-full bg-gradient-to-br from-blue-900 to-blue-500 cursor-pointer 
                        hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-400
                        flex items-center justify-center gap-1 text-white`}
              onClick={handleJoinRoom}
              disabled={!nickname}
            >
              <IoPeople className="text-lg relative right-2 " />
              Join Room
            </button>
            <JoinRoomModal
              nickname={nickname}
              joinRoom={joinRoom}
              onJoinClose={() => setJoinRoom(false)}
              roomIDFromURL={roomIDFromURL!}
              socket={socket}
            />
          </div>
        </div>

        <div className=" text-center p-4">
          <button
            className={`outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                      bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer
                      hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400 `}
          >
            HOW TO PLAY?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
