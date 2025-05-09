import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import { Player } from "../types/types";
import { FaCog, FaCopy } from "react-icons/fa";
import emitterJoinRoom from "../controllers/emitters/emitterJoinRoom";
import emitterLeaveRoom from "../controllers/emitters/emitterLeaveRoom";
import { GlobalErrorContext } from "../contexts/ErrorContext";
import useFirstLoad from "../customHooks/useFirstLoad";
import { events } from "../events/events";

const JoinRoomPage = () => {
  //Get url params for name
  const [params, _] = useSearchParams();
  const nickname = params.get("name");
  const roomID = params.get("roomID");

  //Error Context
  const { setError } = useContext(GlobalErrorContext);

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
        time: null,
        hand: null,
        host: true,
        id: "",
      },
    ],
    totalTeams: 2,
    duration: 120000,
    status: false,
    destroyRoomFlag: false,
    playerID: "",
    playerTeam: "A",
  });

  //Navigator
  const navigate = useNavigate();

  //Subsidiary States
  const [copyLink, setCopyLink] = useState(false);

  const isFirstLoad = useFirstLoad("join-room-reload");

  //Listen To Room Updates
  useEffect(() => {
    if (isFirstLoad !== null) {
      if (isFirstLoad) {
        if (nickname !== null && roomID !== null) {
          emitterJoinRoom(nickname, roomID);
        }
      } else {
        const playerID = localStorage.getItem("playerID");
        emitterLeaveRoom(roomID ? roomID : "", playerID ? playerID : "");
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
    if (!roomID) return;
    navigator.clipboard.writeText(`http://localhost:5173?roomID=${roomID}`);
    setCopyLink(true);
    setTimeout(() => setCopyLink(false), 1000);
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gradient-to-b to-red-50 from-blue-300 p-5">
      <div className="flex items-center justify-between pb-3 border-b border-b-blue-950">
        <div>
          <p className="text-2xl text-blue-950 font-medium">{`You have joined as ${nickname}`}</p>
          <p className="text-blue-950 font-medium text-sm">{`Room Hosted By ${
            roomState.players.filter((x) => x.host)[0].name
          }`}</p>
        </div>
        <button
          className="text-white text-sm bg-blue-950 px-3 py-1.5 rounded cursor-pointer flex items-center justify-center w-40"
          onClick={() =>
            emitterLeaveRoom(
              roomID ? roomID : "",
              roomState.playerID ? roomState.playerID : ""
            )
          }
        >
          Back
        </button>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-lg mt-4 text-blue-950">
              Invite others using the following link :
            </p>
            <p className="text-blue-950 text-sm tracking-wide mt-2">
              {`http://localhost:5173?roomID=${roomID}`}
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
      </div>
      <div className="mt-8">
        <div className="font-medium text-lg mt-4 text-blue-950 flex items-center">
          Game Settings <FaCog className="ml-2" />
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
                    ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none"
                    : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border"
                }
              >
                2 minutes
              </button>
              <button
                className={
                  roomState.duration === 300000
                    ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none"
                    : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border"
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
                    ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none"
                    : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border"
                }
              >
                2 Teams
              </button>
              <button
                className={
                  roomState.totalTeams === 3
                    ? "w-30 py-1.5 rounded text-sm bg-blue-950 text-white border-none"
                    : "w-30 py-1.5 rounded text-sm text-blue-950 border-blue-950 border"
                }
              >
                3 Teams
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-t-blue-950 flex-1 flex flex-col">
        <p className="text-lg font-medium mt-4 text-blue-950">Team Setup</p>
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
    </div>
  );
};

export default JoinRoomPage;
