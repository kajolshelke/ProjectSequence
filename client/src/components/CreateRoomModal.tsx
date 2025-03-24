import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoCopy } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { Player } from "../types/types.ts";

const CreateRoomModal = ({
  nickname,
  createRoom,
  roomID,
  onClose,
  socket,
}: {
  nickname: string;
  createRoom: boolean;
  roomID: string;
  onClose: () => void;
  socket: Socket;
}) => {
  const NoOfTeams = [2, 3] as const;
  const [copyLink, setCopyLink] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [totalTeams, setTotalTeams] = useState<number>(2);

  useEffect(() => {
    if (createRoom) {
      socket.emit("getRoomState", roomID, nickname);
    }
  }, [createRoom]);

  useEffect(() => {
    socket.on(
      "preGameUpdate",
      (players: Player[], totalTeams: number, duration: number) => {
        setTotalTeams(totalTeams);
        setDuration(duration);
        setPlayers(players);
        console.log("hello");
      }
    );
    console.log("lol");
    socket.on("userError", (error) => alert(error));

    return () => {
      socket.off("preGameUpdate");
      socket.off("userError");
    };
  }, [socket]);

  const inviteLink = roomID
    ? `${window.location.origin}/join/?roomID=${roomID}`
    : "";

  // copying invite link
  function copyLinkToClipboard() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopyLink(true);
    setTimeout(() => setCopyLink(false), 1000);
  }

  function updateTurnDuration(time: number) {
    socket.emit("lobbySettingsUpdate", roomID, time, totalTeams, nickname);
  }

  function updateTotalTeams(teamsNo: number) {
    socket.emit("lobbySettingsUpdate", roomID, duration, teamsNo, nickname);
  }

  function updatePlayerTeam(team: "A" | "B" | "C") {
    socket.emit("teamSwitch", team, roomID, nickname);
  }
  return createPortal(
    <div
      className={`z-50 fixed left-0 right-0 bottom-0 top-0 bg-blue-900/50 flex transition-all ease-out
                    ${
                      createRoom
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
    >
      {/* Content */}

      <div className="relative h-[95%] w-[80%] m-auto rounded-md p-3 bg-gradient-to-br from-blue-950 to-blue-800 text-blue-50">
        <IoClose
          className="absolute right-2 text-lg cursor-pointer stroke-3 text-gray-200 "
          onClick={onClose}
        />

        {/* Text */}

        <div className="w-full h-full overflow-auto">
          {/* Host */}
          <p className="text-md font-medium mt-1.5 w-fit shadow-sm shadow-gray-100/50 text-blue-50 p-0.75 px-1 rounded-md">
            HOST - {nickname}
          </p>

          {/* Invite  */}
          <div className="mt-4">
            <p className="font-medium text-xl mb-1">
              Invite others using the following link:
            </p>

            {/* Invite link content */}
            <div className="flex gap-4 relative">
              <div
                className={`outline-none w-[80%] bg-blue-50/20 rounded-md text-orange-500 p-1 px-2.5 font-bold tracking-wide `}
              >
                {inviteLink}
              </div>

              <button
                className={`border-none outline-none px-2 py-1 bg-gradient-to-br from-green-800 to-green-600
                           text-white font-medium rounded-md cursor-pointer
                             hover:bg-gradient-to-br hover:from-green-600 hover:to-green-500 
                             flex gap-1 items-center`}
                onClick={copyLinkToClipboard}
              >
                <IoCopy />
                Copy
              </button>

              {/* Feedback Message */}
              {copyLink && (
                <div className=" absolute right-0.5 top-2 text-green-500 font-medium text-xs">
                  Copied to Clipboard
                </div>
              )}
            </div>
          </div>

          {/* Lobby Settings */}
          <div className="mt-8 ">
            <p className="font-medium text-xl mb-1">Lobby Settings</p>

            {/* Settings spec */}

            <div className="flex justify-between items-center mb-4">
              {/* 1. Player's turn duration */}
              <div className="w-full">
                <p className="text-center mb-3 text-lg font-medium">
                  Set turn duration
                </p>
                <div className="p-1 px-4 flex justify-around text-center mb-8">
                  <button
                    className={`px-4 py-2 outline-none border  cursor-pointer font-medium rounded-md
                              hover:bg-blue-50 hover:border-blue-50 hover:text-blue-950
                              ${
                                duration === 120000
                                  ? "bg-white text-blue-950"
                                  : "text-white "
                              }`}
                    onClick={() => updateTurnDuration(120000)}
                  >
                    2 minutes
                  </button>
                  <button
                    className={`px-4 py-2 outline-none border  cursor-pointer font-medium rounded-md
                              hover:bg-blue-50 hover:border-blue-50 hover:text-blue-950
                              ${
                                duration === 300000
                                  ? "bg-white text-blue-950"
                                  : "text-white "
                              }`}
                    onClick={() => updateTurnDuration(300000)}
                  >
                    5 minutes
                  </button>
                </div>
              </div>

              <div className="w-full">
                <p className="text-center mb-3 text-lg font-medium">
                  Set total teams
                </p>
                <div className="p-1 px-4 flex justify-around text-center mb-8">
                  {NoOfTeams.map((x, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 outline-none border border-white cursor-pointer font-medium rounded-md
                    hover:bg-blue-50 hover:border-blue-50 hover:text-blue-950
                    ${
                      totalTeams === x
                        ? "bg-white text-blue-950"
                        : "text-white "
                    }`}
                      onClick={() => updateTotalTeams(x)}
                    >
                      {x}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2.Customize team */}
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

          {/* Start game */}
          <div className="mt-4">
            <button
              className={`m-auto flex  gap-1
                        outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                        bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer
                        hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400`}
            >
              START GAME
              <MdKeyboardDoubleArrowRight className="text-2xl font-bold" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal")!
  );
};

export default CreateRoomModal;
