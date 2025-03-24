import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Socket } from "socket.io-client";
import { Player } from "../types/types";

const JoinRoomModal = ({
  nickname,
  joinRoom,
  onJoinClose,
  roomIDFromURL,
  socket,
}: {
  nickname: string;
  joinRoom: boolean;
  onJoinClose: () => void;
  roomIDFromURL: string;
  socket: Socket;
}) => {
  const roomID = roomIDFromURL;
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalTeams, setTotalTeams] = useState<number>(2);

  function updatePlayerTeam(team: "A" | "B" | "C") {
    socket.emit("teamSwitch", team, roomID, nickname);
  }

  useEffect(() => {
    if (joinRoom) {
      socket.emit("getRoomState", roomID, nickname);
    }
  }, [joinRoom]);

  useEffect(() => {
    socket.on(
      "preGameUpdate",
      (players: Player[], totalTeams: number, duration: number) => {
        setTotalTeams(totalTeams);
        setPlayers(players);
      }
    );
    socket.on("userError", (error) => alert(error));

    return () => {
      socket.off("preGameUpdate");
      socket.off("userError");
    };
  }, [socket]);

  return createPortal(
    <div
      className={`z-50 fixed left-0 bottom-0 right-0 top-0 bg-blue-900/50 flex transition-all ease-out
                    ${
                      joinRoom
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
    >
      <div className="relative w-[50%] h-[55%] p-3 m-auto bg-gradient-to-br from-blue-950 to-blue-800 rounded-md text-blue-50">
        <IoClose
          className="absolute right-2 text-lg cursor-pointer stroke-3 text-gray-200"
          onClick={onJoinClose}
        />

        <p className="text-md font-medium mt-4  shadow-sm shadow-gray-100/50 w-fit text-blue-50 p-0.75 px-1 rounded-md">
          JOIN AS - {nickname}
        </p>

        <div className="flex mt-4 mb-4 items-start gap-1.5">
          <p className="text-lg">Room ID</p>
          <div
            id="roomID"
            className=" mb-4 outline-none shadow-lg ml-2  text-blue-50 px-2 py-1 rounded-md w-[60%] bg-blue-50/20 "
          >
            {roomIDFromURL}
          </div>
        </div>

        <p className="text-center mb-3 text-lg font-medium">Team Setup</p>
        {/* 2 teams customization */}
        <div className="w-full flex px-4 gap-4">
          {/* Team A */}
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => updatePlayerTeam("A")}
              className={`text-sm px-2 py-1 outline-none cursor-pointer font-medium rounded-md tracking-wide
                            bg-gradient-to-br from-gray-600 to-gray-500 hover:bg-gradient-to-br
                            hover:from-gray-500 hover:to-gray-400 w-fit mb-2`}
            >
              SWITCH TO TEAM A
            </button>
            <div className="w-full h-40 p-3 rounded-md bg-slate-50/50 ">
              {players
                .filter((x) => x.team === "A")
                .map((x, i) => (
                  <p
                    key={i}
                    className="m-2 inline-block bg-gradient-to-br from-blue-600 to-blue-500 p-2 py-0.5 rounded-md w-fit"
                  >
                    {x.name}
                  </p>
                ))}
            </div>
          </div>

          {/* Team B */}
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => updatePlayerTeam("B")}
              className={`text-sm px-2 py-1 outline-none cursor-pointer font-medium rounded-md tracking-wide
                            bg-gradient-to-br from-gray-600 to-gray-500 hover:bg-gradient-to-br
                            hover:from-gray-500 hover:to-gray-400 w-fit mb-2`}
            >
              SWITCH TO TEAM B
            </button>
            <div className="w-full h-40 p-3 rounded-md bg-slate-50/50">
              {players
                .filter((x) => x.team === "B")
                .map((x, i) => (
                  <p
                    key={i}
                    className="m-2 inline-block bg-gradient-to-br from-blue-600 to-blue-500 p-2 py-0.5 rounded-md w-fit"
                  >
                    {x.name}
                  </p>
                ))}
            </div>
          </div>

          {totalTeams === 3 && (
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => updatePlayerTeam("C")}
                className={`text-sm px-2 py-1 outline-none cursor-pointer font-medium rounded-md tracking-wide
                          bg-gradient-to-br from-gray-600 to-gray-500 hover:bg-gradient-to-br
                          hover:from-gray-500 hover:to-gray-400 w-fit mb-2`}
              >
                SWITCH TO TEAM C
              </button>
              <div className="w-full h-40 p-3 rounded-md bg-slate-50/50">
                {players
                  .filter((x) => x.team === "C")
                  .map((x, i) => (
                    <p
                      key={i}
                      className="m-2 inline-block bg-gradient-to-br from-blue-600 to-blue-500 p-2 py-0.5 rounded-md w-fit"
                    >
                      {x.name}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("portal")!
  );
};

export default JoinRoomModal;
