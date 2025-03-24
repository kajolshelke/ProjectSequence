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
}

const PlayingCard = ({ rank, suit }: Props) => {
  const Icon = suits[suit];

  return (
    <div
      className={`w-full h-full bg-white rounded flex flex-col justify-between px-2  ${
        (suit === "Heart" || suit === "Diamond") && "text-red-500"
      } ${suit === "Joker" && "text-blue-900"}`}
    >
      <div className="flex justify-between items-center">
        <div className="-rotate-90 font-bold text-sm">{numbers[rank]}</div>
        <Icon className=" -rotate-90 text-sm" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Icon className=" -rotate-90 text-lg" />
      </div>
      <div className="flex items-center justify-between">
        <Icon className=" -rotate-90 text-sm" />
        <div className=" -rotate-90 font-bold text-sm">{numbers[rank]}</div>
      </div>
    </div>
  );
};

export default PlayingCard;
