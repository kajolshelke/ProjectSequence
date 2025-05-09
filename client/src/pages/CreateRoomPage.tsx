import { useEffect, useState, useContext } from "react";
import emitterCreateRoom from "../controllers/emitters/emitterCreateRoom";
import { useSearchParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { events } from "../events/events";
import { Player } from "../types/types";
import { FaCog, FaCopy } from "react-icons/fa";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import emitterRoomDestroy from "../controllers/emitters/emitterRoomDestroy";
import { GlobalErrorContext } from "../contexts/ErrorContext";
import useFirstLoad from "../customHooks/useFirstLoad";

const CreateRoomPage = () => {
  //Get url params for name
  const [params, setParams] = useSearchParams();
  const nickname = params.get("name");

  //Error Context
  const { setError } = useContext(GlobalErrorContext);

  //Navigator
  const navigate = useNavigate();

  //Room State
  const [roomState, setRoomState] = useState<{
    roomID: string;
    players: Player[];
    totalTeams: number;
    duration: number;
    status: boolean;
    destroyRoomFlag: boolean;
    playerID: string;
    playerTeam: "A" | "B" | "C";
  }>({
    roomID: "",
    players: [
      {
        name: nickname ? nickname : "",
        team: "A",
        id: "",
        time: null,
        hand: null,
        host: true,
      },
    ],
    totalTeams: 2,
    duration: 120000,
    status: false,
    destroyRoomFlag: false,
    playerID: "",
    playerTeam: "A",
  });

  //Subsidiary States
  const [copyLink, setCopyLink] = useState(false);

  const isFirstLoad = useFirstLoad("create-room-reload");
  //Listen To Room Updates
  useEffect(() => {
    if (isFirstLoad !== null) {
      if (isFirstLoad) {
        if (nickname !== null) {
          emitterCreateRoom(nickname);
        }
      } else {
        emitterRoomDestroy(roomState.roomID);
        navigate("/");
      }
    }
    //Update On Room Configuration
    socket.on(
      events.roomStateAcknowledgement.name,
      (
        roomID,
        players: Player[],
        totalTeams: number,
        duration: number,
        status: boolean,
        destroyRoomFlag: boolean
      ) => {
        if (destroyRoomFlag) {
          setError("Room Destroyed");
          navigate("/");
        } else {
          setParams({ roomID: roomID, name: nickname ? nickname : "" });

          localStorage.setItem(
            "playerID",
            players.filter((x) => x.name === nickname)[0].id
          );

          const playerID = players.filter((x) => x.name === nickname)[0].id;
          const playerTeam = players.filter((x) => x.name === nickname)[0].team;
          if (status) {
            navigate(`/ongoing?roomID=${roomID}`);
          } else {
            setRoomState({
              roomID,
              players,
              totalTeams,
              duration,
              status,
              destroyRoomFlag,
              playerID,
              playerTeam,
            });
          }
        }
      }
    );

    socket.on(events.userError.name, (error) => {
      setError(error);
    });

    return () => {
      socket.off(events.roomStateAcknowledgement.name);
      socket.off(events.userError.name);
    };
  }, [isFirstLoad]);

  // Copying Link To Clipboard
  function copyLinkToClipboard() {
    if (!roomState.roomID) return;
    navigator.clipboard.writeText(
      `http://localhost:5173?roomID=${roomState.roomID}`
    );
    setCopyLink(true);
    setTimeout(() => setCopyLink(false), 1000);
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b to-red-50 from-blue-300 p-5">
      <div className="flex items-center justify-between pb-5 border-b border-b-blue-950">
        <p className="text-2xl text-blue-950 font-medium">{`Room Hosted By ${nickname}`}</p>
        <button
          className="text-white text-sm bg-blue-950 px-3 py-1.5 rounded cursor-pointer flex items-center justify-center w-40"
          onClick={() => emitterRoomDestroy(roomState.roomID)}
        >
          Close
        </button>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-lg mt-4 text-blue-950">
              Invite others using the following link :
            </p>
            <p className="text-blue-950 text-sm tracking-wide mt-2">
              {`http://localhost:5173?roomID=${roomState.roomID}`}
            </p>
          </div>
          <button
            className="text-white text-sm bg-green-700 px-3 py-1.5 rounded cursor-pointer flex items-center justify-center w-40"
            onClick={copyLinkToClipboard}
          >
            {copyLink ? "Link Copied" : "Copy Link"}
            <FaCopy className="ml-2" />
          </button>
        </div>
        <div className="mt-8">
          <div className="font-medium text-lg mt-4 text-blue-950 flex items-center">
            Configure Game Settings <FaCog className="ml-2" />
          </div>
          <div className="mb-4 mt-4 flex gap-10">
            <div className="pb-5">
              <p className="mt-3 font-medium text-blue-950">Turn Duration</p>
              <p className="font-medium text-blue-950 text-xs tracking-wide">
                Set how much time each player has to make a move.
              </p>
              <div className="mt-3 flex items-center gap-5">
                <button
                  className={
                    roomState.duration === 120000
                      ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none cursor-pointer"
                      : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border cursor-pointer"
                  }
                  onClick={() =>
                    socket.emit(
                      events.preGameUpdateRoom.name,
                      roomState.roomID,
                      120000,
                      roomState.totalTeams,
                      roomState.playerID,
                      roomState.playerTeam
                    )
                  }
                >
                  2 minutes
                </button>
                <button
                  className={
                    roomState.duration === 300000
                      ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none cursor-pointer"
                      : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border cursor-pointer"
                  }
                  onClick={() =>
                    socket.emit(
                      events.preGameUpdateRoom.name,
                      roomState.roomID,
                      300000,
                      roomState.totalTeams,
                      roomState.playerID,
                      roomState.playerTeam
                    )
                  }
                >
                  5 minutes
                </button>
              </div>
            </div>
            <div className="pl-10 border-l-blue-950 border-l pb-5">
              <p className="mt-3 font-medium text-blue-950">Number Of Teams</p>
              <p className="font-medium text-blue-950 text-xs tracking-wide">
                Set how many teams should be available.
              </p>
              <div className="mt-3 flex items-center gap-5">
                <button
                  className={
                    roomState.totalTeams === 2
                      ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none cursor-pointer"
                      : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border cursor-pointer"
                  }
                  onClick={() =>
                    socket.emit(
                      events.preGameUpdateRoom.name,
                      roomState.roomID,
                      roomState.duration,
                      2,
                      roomState.playerID,
                      roomState.playerTeam
                    )
                  }
                >
                  2 Teams
                </button>
                <button
                  className={
                    roomState.totalTeams === 3
                      ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none cursor-pointer"
                      : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border cursor-pointer"
                  }
                  onClick={() =>
                    socket.emit(
                      events.preGameUpdateRoom.name,
                      roomState.roomID,
                      roomState.duration,
                      3,
                      roomState.playerID,
                      roomState.playerTeam
                    )
                  }
                >
                  3 Teams
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-t-blue-950 flex-1 flex flex-col">
        <p className="text-lg font-medium mt-4 text-blue-950">Team Setup</p>
        {/* 2 teams customization */}
        <div className="w-full flex gap-4 mt-4 flex-1">
          <div className="w-full flex flex-col flex-1">
            <button
              className="flex mb-3 text-sm outline-none border-none px-5 py-1.5 tracking-wide text-white font-medium rounded bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400 w-fit"
              onClick={() =>
                socket.emit(
                  events.preGameUpdateRoom.name,
                  roomState.roomID,
                  roomState.duration,
                  roomState.totalTeams,
                  roomState.playerID,
                  "A"
                )
              }
            >
              Switch To Team A
            </button>
            <div className="w-full flex-1 rounded-md border bg-blue-950">
              {roomState.players
                .filter((x) => x.team === "A")
                .map((x, i) => (
                  <div
                    key={i}
                    className="h-1/6 p-2 flex items-stretch justify-center"
                  >
                    <p className="text-blue-950 font-medium tracking-wide bg-white w-full flex items-center justify-center rounded">
                      {x.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full flex flex-col flex-1">
            <button
              className="flex mb-3 text-sm outline-none border-none px-5 py-1.5 tracking-wide text-white font-medium rounded bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400 w-fit"
              onClick={() =>
                socket.emit(
                  events.preGameUpdateRoom.name,
                  roomState.roomID,
                  roomState.duration,
                  roomState.totalTeams,
                  roomState.playerID,
                  "B"
                )
              }
            >
              Switch To Team B
            </button>
            <div className="w-full flex-1 rounded-md border bg-blue-950">
              {roomState.players
                .filter((x) => x.team === "B")
                .map((x, i) => (
                  <div
                    key={i}
                    className="h-1/6 p-2 flex items-stretch justify-center"
                  >
                    <p className="text-blue-950 font-medium tracking-wide bg-white w-full flex items-center justify-center rounded">
                      {x.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          {roomState.totalTeams === 3 && (
            <div className="w-full flex flex-col flex-1">
              <button
                className="flex mb-3 text-sm outline-none border-none px-5 py-1.5 tracking-wide text-white font-medium rounded bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400 w-fit"
                onClick={() =>
                  socket.emit(
                    events.preGameUpdateRoom.name,
                    roomState.roomID,
                    roomState.duration,
                    roomState.totalTeams,
                    roomState.playerID,
                    "C"
                  )
                }
              >
                Switch To Team C
              </button>
              <div className="w-full flex-1 rounded-md border bg-blue-950">
                {roomState.players
                  .filter((x) => x.team === "C")
                  .map((x, i) => (
                    <div
                      key={i}
                      className="h-1/6 p-2 flex items-stretch justify-center"
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
      <div className="mt-6 flex justify-center">
        <button
          onClick={() =>
            socket.emit(
              events.gameStart.name,
              roomState.playerID,
              roomState.roomID
            )
          }
          className="flex outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400"
        >
          START GAME
          <MdKeyboardDoubleArrowRight className="text-2xl font-bold" />
        </button>
      </div>
    </div>
  );
};

export default CreateRoomPage;
