import { useNavigate, useSearchParams } from "react-router-dom";
import { events } from "../events/events";
import socket from "../socket/socket";
import HandCard from "./HandCard";
import PlayHandCardSound from "./PlayHandCardSound";
import PlayDeadCardSound from "./PlayDeadCardSound";
import { useState } from "react";
import Rules from "./Rules";

const PlayerPanel = ({
  selectedCardFromHand,
  setSelectedCardFromHand,
  hand,
  nextPlayerName,
  nextPlayerTeam,
  noOfCardsLeftInDrawDeck,
  playerTimeRemaining,
}: {
  selectedCardFromHand:
    | {
        rank: number;
        suit: "Heart" | "Spade" | "Club" | "Diamond";
      }
    | undefined;
  setSelectedCardFromHand: (a: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond";
  }) => void;
  hand: { rank: number; suit: "Heart" | "Spade" | "Club" | "Diamond" }[];
  nextPlayerName: string;
  nextPlayerTeam: string;
  noOfCardsLeftInDrawDeck: number;
  playerTimeRemaining: number;
}) => {
  function formatTime(timeInMS: number) {
    const totalSeconds = Math.max(0, Math.floor(timeInMS / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  const playerID = localStorage.getItem("playerID");
  const [params, _] = useSearchParams();
  const roomID = params.get("roomID");
  const navigate = useNavigate();

  const [viewRules, setViewRules] = useState(false);
  return (
    <div className=" bg-gradient-to-b from-blue-950 to-blue-900 w-full rounded-md px-3 py-4 flex-1 gap-3 flex flex-col">
      <div className="flex justify-between   bg-gray-300/20 px-2 py-1 rounded-sm  text-blue-50">
        <div>Time remaining</div>
        <div>{formatTime(playerTimeRemaining)}</div>
      </div>

      <div className="bg-gray-300/20  px-2 py-2 pb-3 rounded-sm ">
        <p className=" text-blue-50 text-center mb-1">Current turn</p>
        <div className="flex flex-col justify-between gap-3 text-center text-white">
          <div className="flex gap-3 items-center justify-center w-full bg-black/40 px-2 py-1 rounded-sm">
            <p>Team : {nextPlayerTeam}</p>
            <div
              className={`w-4 h-4 rounded-full ${
                nextPlayerTeam === "A"
                  ? "bg-gradient-to-b from-orange-600 to-orange-400"
                  : nextPlayerTeam === "B"
                  ? "bg-gradient-to-b from-blue-700 to-blue-500"
                  : nextPlayerTeam === "C"
                  ? "bg-gradient-to-b from-green-700 to-green-500"
                  : ""
              }  `}
            ></div>
          </div>
          <p className="w-full  bg-black/40 px-2 py-1 rounded-sm">
            Player : {nextPlayerName}
          </p>
        </div>
      </div>

      <div className="bg-gray-300/20  px-2 py-3 rounded-sm flex-1 flex flex-col justify-between">
        <div className="flex flex-col ">
          <p className="text-center text-white max-[1600px]:mb-2 max-[3000px]:mb-4 bg-black/40 p-1 rounded-sm">
            Player's Hand
          </p>
          <div className="flex flex-wrap max-[1600px]:gap-3 max-[3000px]:gap-4 items-center justify-center">
            {hand.map((card, index) => (
              <div
                className={`${
                  selectedCardFromHand?.rank === card.rank &&
                  selectedCardFromHand.suit === card.suit
                    ? "rounded-md border-2 border-orange-500"
                    : ""
                }
                         p-[0.1rem] `}
                key={index}
                onClick={() => {
                  setSelectedCardFromHand({ rank: card.rank, suit: card.suit });
                  PlayHandCardSound();
                }}
              >
                <HandCard rank={card.rank} suit={card.suit} />
              </div>
            ))}
          </div>
        </div>
        <button
          className={` text-sm w-full bg-gradient-to-br from-blue-800 to-blue-500 rounded-md font-medium
                             text-white px-1 max-[1600px]:py-1 max-[3000px]:py-2 tracking-wide cursor-pointer hover:bg-gradient-to-br
                             hover:from-blue-700 hover:to-blue-400`}
          onClick={() => {
            socket.emit(
              events.deadCard.name,
              playerID,
              roomID,
              selectedCardFromHand
            );
            PlayDeadCardSound();
          }}
        >
          Add card to discard pile
        </button>
      </div>

      <div className="text-white text-sm text-center px-2 py-2  bg-gray-300/20 rounded-sm">
        Cards remaining in deck : {noOfCardsLeftInDrawDeck}
      </div>
      <div>
        <button
          className={`w-full mb-4 outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                      bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer
                      hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400`}
          onClick={() => setViewRules(true)}
        >
          View Rules
        </button>

        <button
          className={`w-full  outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                      bg-gradient-to-br from-red-700 to-red-500 cursor-pointer
                      hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500`}
          onClick={() => {
            socket.emit(events.postGameLeaveRoom.name, roomID, playerID);
            navigate("/");
          }}
        >
          Leave Room
        </button>
      </div>
      {viewRules && <Rules onClose={() => setViewRules(false)} />}
    </div>
  );
};

export default PlayerPanel;
