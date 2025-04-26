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
}

const PlayingCard = ({ rank, suit, enabled, team }: Props) => {
  const Icon = suits[suit];

  return (
    <div
      className={`w-full h-full shadow-boardcard bg-white ${
        enabled ? "border-2 border-blue-800" : "border border-white"
      } rounded flex flex-col justify-between px-2 py-0.5  ${
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
            <div className="w-5 h-5 rounded-full bg-orange-500 absolute"></div>
          ) : team === "B" ? (
            <div className="w-5 h-5 rounded-full bg-blue-600 absolute"></div>
          ) : team === "C" ? (
            <div className="w-5 h-5 rounded-full bg-green-600 absolute"></div>
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
