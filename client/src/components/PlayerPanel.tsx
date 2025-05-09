import { useSearchParams } from "react-router-dom";
import { events } from "../events/events";
import socket from "../socket/socket";
import HandCard from "./HandCard";
import PlayHandCardSound from "./PlayHandCardSound";

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

  return (
    <div className=" bg-gradient-to-b from-blue-950 to-blue-900 w-full rounded-md px-3 py-4 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-between mb-4  bg-gray-300/20 px-2 py-1 rounded-sm  text-blue-50">
          <div>Time remaining</div>
          <div>{formatTime(playerTimeRemaining)}</div>
        </div>

        <div className="bg-gray-300/20 mb-4 px-2 py-2 pb-3 rounded-sm ">
          <p className=" text-blue-50 text-center mb-1">Current turn</p>
          <div className="flex flex-col justify-between gap-3 text-center text-white">
            <div className="flex gap-3 items-center justify-center w-full bg-black/40 px-2 py-1 rounded-sm">
              <p>Team : {nextPlayerTeam}</p>
              <div
                className={`w-4 h-4 rounded-full ${
                  nextPlayerTeam === "A"
                    ? "bg-orange-500"
                    : nextPlayerTeam === "B"
                    ? "bg-blue-600"
                    : nextPlayerTeam === "C"
                    ? "bg-green-600"
                    : ""
                }  `}
              ></div>
            </div>
            <p className="w-full  bg-black/40 px-2 py-1 rounded-sm">
              Player : {nextPlayerName}
            </p>
          </div>
        </div>

        <div className="bg-gray-300/20 mb-1 px-2 py-3 rounded-sm ">
          <p className="text-center text-white mb-4 bg-black/40 p-1 rounded-sm">
            Player's Hand
          </p>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {hand.map((card, index) => (
              <div
                className={`${
                  selectedCardFromHand?.rank === card.rank &&
                  selectedCardFromHand.suit === card.suit
                    ? "rounded-md border-2 border-orange-500"
                    : ""
                }
                         p-[0.1rem] w-16 h-24 min-w-12 min-h-20`}
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
          <button
            className={`mt-2 text-sm w-full bg-gradient-to-br from-gray-900 to-gray-600 rounded-md
                             text-white px-1 py-0.5 tracking-wide cursor-pointer hover:bg-gradient-to-br
                             hover:from-gray-800 hover:to-gray-600`}
            onClick={() =>
              socket.emit(
                events.deadCard.name,
                playerID,
                roomID,
                selectedCardFromHand
              )
            }
          >
            Add card to discard pile
          </button>
        </div>
      </div>

      <div className="text-white text-sm text-center px-2 py-0.5 mb-2 bg-gray-300/20 rounded-sm">
        Cards remaining in deck : {noOfCardsLeftInDrawDeck}
      </div>
      <div>
        <button
          className={`w-full mb-4 outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                      bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer
                      hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400`}
        >
          View Rules
        </button>

        <button
          className={`w-full  outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md
                      bg-gradient-to-br from-red-700 to-red-500 cursor-pointer
                      hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500`}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default PlayerPanel;
