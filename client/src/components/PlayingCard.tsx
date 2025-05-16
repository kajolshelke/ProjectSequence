import { BsFillSuitClubFill } from "react-icons/bs";
import { BsSuitSpadeFill } from "react-icons/bs";
import { BsSuitHeartFill } from "react-icons/bs";
import { BsSuitDiamondFill } from "react-icons/bs";
import { TbCircleDashedLetterS } from "react-icons/tb";

const suits = {
  Heart: BsSuitHeartFill,
  Spade: BsSuitSpadeFill,
  Diamond: BsSuitDiamondFill,
  Club: BsFillSuitClubFill,
  Joker: TbCircleDashedLetterS,
};

const numbers = [
  "0",
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

interface Props {
  rank: number;
  suit: "Heart" | "Club" | "Spade" | "Diamond" | "Joker";
  enabled: boolean;
  team: "A" | "B" | "C" | null;
  sequenceCard: boolean;
  highlightMoveCard: boolean;
}

const PlayingCard = ({
  rank,
  suit,
  enabled,
  team,
  sequenceCard,
  highlightMoveCard,
}: Props) => {
  const Icon = suits[suit];

  return (
    <div
      className={`w-full h-full shadow-boardcard 
        ${
          sequenceCard
            ? "bg-gray-300"
            : highlightMoveCard
            ? "animate-flash"
            : "bg-white"
        }  ${
        enabled ? "border-[3px] border-red-600" : "border border-white"
      } rounded flex flex-col justify-between px-2   ${
        (suit === "Heart" || suit === "Diamond") && "text-red-500"
      } ${suit === "Joker" && "text-blue-900"}`}
    >
      <div className="flex justify-between items-center">
        <div className="-rotate-90 font-bold text-sm">
          {suit === "Joker" ? "" : numbers[rank]}
        </div>
        <Icon className=" -rotate-90 text-sm" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        {team ? (
          team === "A" ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-orange-600 to-orange-400  absolute"></div>
          ) : team === "B" ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-blue-700 to-blue-400 absolute"></div>
          ) : team === "C" ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-green-700 to-green-500 absolute"></div>
          ) : (
            <></>
          )
        ) : (
          <Icon className=" -rotate-90 " />
        )}
      </div>
      <div className="flex items-center justify-between">
        <Icon className=" -rotate-90 text-sm" />
        <div className=" -rotate-90 font-bold text-sm">
          {suit === "Joker" ? "" : numbers[rank]}
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
