import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { FaCog } from "react-icons/fa";
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
      className={`z-50 fixed left-0 right-0 bottom-0 top-0 bg-blue-900/50 flex items-center justify-center
                    ${
                      createRoom
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
    >
      {/* Content */}

      <div className="h-[95%] w-[80%] rounded p-5 bg-gradient-to-b from-blue-950 to-blue-900 flex flex-col">
        <div className="flex items-stretch justify-between">
          <p className="text-2xl text-white font-medium">{`Room Hosted By ${nickname}`}</p>
          <button
            className="text-white text-sm border-white border px-3 rounded cursor-pointer flex items-center"
            onClick={onClose}
          >
            Close Room <IoMdClose className="ml-1 relative top-[0.05em]" />
          </button>
        </div>
        <div>
          <div className="mt-4 border-t border-t-white flex items-center justify-between">
            <div>
              <p className="font-medium text-lg mt-4 text-white">
                Invite others using the following link :
              </p>
              <p className="text-white text-sm tracking-wide mt-2">
                {inviteLink}
              </p>
            </div>
            <button
              className="text-white text-sm border-white border px-3 rounded cursor-pointer flex items-center py-2"
              onClick={copyLinkToClipboard}
            >
              {copyLink ? "Link Copied" : "Copy Link"}
              <FaCopy className="ml-2" />
            </button>
          </div>

          {/* Lobby Settings */}
          <div className="mt-8">
            <div className="font-medium text-lg mt-4 text-white flex items-center">
              Configure Game Settings <FaCog className="ml-2" />
            </div>

            {/* Settings spec */}

            <div className=" mb-4">
              {/* 1. Player's turn duration */}
              <div>
                <p className="mt-3 font-medium text-white">Turn Duration</p>
                <p className="font-medium text-white text-xs tracking-wide">
                  Decide how much time each player has to make a move.
                </p>
                <div className="mt-3 flex items-center gap-5">
                  <button
                    className={`px-4 py-2 outline-none border cursor-pointer font-medium rounded text-sm
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
                    className={`px-4 py-2 outline-none border cursor-pointer font-medium rounded text-sm
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

              <div className="mt-5">
                <p className="mt-3 font-medium text-white">Number Of Teams</p>
                <p className="font-medium text-white text-xs tracking-wide">
                  Decide how much teams should be available.
                </p>
                <div className="mt-3 flex items-center gap-5">
                  <button
                    className={`px-4 py-2 outline-none border cursor-pointer font-medium rounded text-sm
                    ${
                      totalTeams === 2
                        ? "bg-white text-blue-950"
                        : "text-white "
                    }`}
                    onClick={() => updateTotalTeams(2)}
                  >
                    2 Teams
                  </button>
                  <button
                    className={`px-4 py-2 outline-none border cursor-pointer font-medium rounded text-sm
                    ${
                      totalTeams === 3
                        ? "bg-white text-blue-950"
                        : "text-white "
                    }`}
                    onClick={() => updateTotalTeams(3)}
                  >
                    3 Teams
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-t-white flex-1 flex flex-col">
          <p className="text-lg font-medium mt-5 text-white">Team Setup</p>
          {/* 2 teams customization */}
          <div className="w-full flex gap-4 mt-4 flex-1">
            <div className="w-full flex flex-col items-center flex-1">
              <button
                onClick={() => updatePlayerTeam("A")}
                className="text-sm py-2 bg-white text-blue-950 font-medium tracking-wide w-full mb-3 rounded cursor-pointer"
              >
                Switch To Team A
              </button>
              <div className="w-full flex-1 rounded-md border border-white">
                {players
                  .filter((x) => x.team === "A")
                  .map((x, i) => (
                    <div
                      key={i}
                      className="h-1/5 p-2 flex items-stretch justify-center"
                    >
                      <p className="text-blue-950 font-medium tracking-wide bg-white w-full flex items-center justify-center rounded">
                        {x.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Team B */}
            <div className="w-full flex flex-col items-center flex-1">
              <button
                onClick={() => updatePlayerTeam("B")}
                className="text-sm py-2 bg-white text-blue-950 font-medium tracking-wide w-full mb-3 rounded cursor-pointer"
              >
                Switch To Team B
              </button>
              <div className="w-full flex-1 rounded-md border border-white">
                {players
                  .filter((x) => x.team === "B")
                  .map((x, i) => (
                    <div
                      key={i}
                      className="h-1/5 p-2 flex items-stretch justify-center"
                    >
                      <p className="text-blue-950 font-medium tracking-wide bg-white w-full flex items-center justify-center rounded">
                        {x.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {totalTeams === 3 && (
              <div className="w-full flex flex-col items-center flex-1">
                <button
                  onClick={() => updatePlayerTeam("C")}
                  className="text-sm py-2 bg-white text-blue-950 font-medium tracking-wide w-full mb-3 rounded cursor-pointer"
                >
                  Switch To Team C
                </button>
                <div className="w-full flex-1 rounded-md border border-white">
                  {players
                    .filter((x) => x.team === "C")
                    .map((x, i) => (
                      <div
                        key={i}
                        className="h-1/5 p-2 flex items-stretch justify-center"
                      >
                        <p className="text-blue-950 font-medium tracking-wide bg-white w-full flex items-center justify-center rounded">
                          {x.name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Start game */}
        <div className="mt-6">
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
    </div>,
    document.getElementById("portal")!
  );
};

export default CreateRoomModal;
