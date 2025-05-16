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

const HandCard = ({ rank, suit }: Props) => {
  const Icon = suits[suit];

  return (
    <div
      className={`w-full h-full bg-white rounded flex flex-col justify-between px-2 cursor-pointer
         max-[3000px]:h-28 max-[3000px]:w-20
         max-[1600px]:h-24 max-[1600px]:w-16 max-[1491px]:h-[90px] max-[1491px]:w-[60px] max-[1427px]:h-[81px] max-[1427px]:w-[54px]
         max-[1331px]:h-16 max-[1331px]:w-16 max-[1158px]:h-12 max-[1158px]:w-12 
         ${(suit === "Heart" || suit === "Diamond") && "text-red-500"} ${
        suit === "Joker" && "text-blue-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-sm max-[1158px]:text-xs max-[1025px]:text-[10px]">
          {numbers[rank]}
        </div>
        <Icon className="text-sm max-[1158px]:text-xs max-[1025px]:text-[10px]" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Icon className="text-lg max-[1158px]:text-sm max-[1025px]:text-[12px]" />
      </div>
      <div className="flex items-center justify-between">
        <Icon className="text-sm max-[1158px]:text-xs max-[1025px]:text-[10px]" />
        <div className="font-bold text-sm max-[1158px]:text-xs max-[1025px]:text-[10px]">
          {numbers[rank]}
        </div>
      </div>
    </div>
  );
};

export default HandCard;
