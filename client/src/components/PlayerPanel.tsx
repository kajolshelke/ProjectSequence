import HandCard from "./HandCard";

const PlayerPanel = ({
  selectedCardFromHand,
  setSelectedCardFromHand,
  hand,
  nextPlayerName,
  nextPlayerTeam,
  noOfCardsLeftInDrawDeck,
  playerTimeRemaining,
}: {
  selectedCardFromHand?: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond";
  };
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
            <p className="w-full bg-black/40 px-2 py-1 rounded-sm">
              Team : {nextPlayerTeam}
            </p>
            <p className="w-full  bg-black/40 px-2 py-1 rounded-sm">
              Player : {nextPlayerName}
            </p>
          </div>
        </div>

        <div className="bg-gray-300/20 mb-4 px-2 py-3 rounded-sm ">
          <p className="text-center text-white mb-4 bg-black/40 p-1 rounded-sm">
            Player's Hand
          </p>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {hand.map((card, index) => (
              <div
                className="w-16 h-24 min-w-12 min-h-20"
                key={index}
                onClick={() =>
                  setSelectedCardFromHand({ rank: card.rank, suit: card.suit })
                }
              >
                <HandCard rank={card.rank} suit={card.suit} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-white text-center px-2 py-1 bg-gray-300/20 rounded-sm">
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
