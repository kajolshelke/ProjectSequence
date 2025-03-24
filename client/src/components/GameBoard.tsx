import { useState } from "react";
import PlayingCard from "./PlayingCard";

const GameBoard = () => {
  const boardPattern = [
    [
      { rank: 0, suit: "Joker" },
      { rank: 10, suit: "Spade" },
      { rank: 12, suit: "Spade" },
      { rank: 13, suit: "Spade" },
      { rank: 1, suit: "Spade" },
      { rank: 2, suit: "Diamond" },
      { rank: 3, suit: "Diamond" },
      { rank: 4, suit: "Diamond" },
      { rank: 5, suit: "Diamond" },
      { rank: 0, suit: "Joker" },
    ],
    [
      { rank: 9, suit: "Spade" },
      { rank: 10, suit: "Heart" },
      { rank: 9, suit: "Heart" },
      { rank: 8, suit: "Heart" },
      { rank: 7, suit: "Heart" },
      { rank: 6, suit: "Heart" },
      { rank: 5, suit: "Heart" },
      { rank: 4, suit: "Heart" },
      { rank: 3, suit: "Heart" },
      { rank: 6, suit: "Diamond" },
    ],
    [
      { rank: 8, suit: "Spade" },
      { rank: 12, suit: "Heart" },
      { rank: 7, suit: "Diamond" },
      { rank: 8, suit: "Diamond" },
      { rank: 9, suit: "Diamond" },
      { rank: 10, suit: "Diamond" },
      { rank: 12, suit: "Diamond" },
      { rank: 13, suit: "Diamond" },
      { rank: 2, suit: "Heart" },
      { rank: 7, suit: "Diamond" },
    ],
    [
      { rank: 7, suit: "Spade" },
      { rank: 13, suit: "Heart" },
      { rank: 6, suit: "Diamond" },
      { rank: 2, suit: "Club" },
      { rank: 1, suit: "Heart" },
      { rank: 13, suit: "Heart" },
      { rank: 12, suit: "Heart" },
      { rank: 1, suit: "Diamond" },
      { rank: 2, suit: "Spade" },
      { rank: 8, suit: "Diamond" },
    ],
    [
      { rank: 6, suit: "Spade" },
      { rank: 1, suit: "Heart" },
      { rank: 5, suit: "Diamond" },
      { rank: 3, suit: "Club" },
      { rank: 4, suit: "Heart" },
      { rank: 3, suit: "Heart" },
      { rank: 10, suit: "Heart" },
      { rank: 1, suit: "Club" },
      { rank: 3, suit: "Spade" },
      { rank: 9, suit: "Diamond" },
    ],
    [
      { rank: 5, suit: "Spade" },
      { rank: 2, suit: "Club" },
      { rank: 4, suit: "Diamond" },
      { rank: 4, suit: "Club" },
      { rank: 5, suit: "Heart" },
      { rank: 2, suit: "Heart" },
      { rank: 9, suit: "Heart" },
      { rank: 13, suit: "Club" },
      { rank: 4, suit: "Spade" },
      { rank: 10, suit: "Diamond" },
    ],
    [
      { rank: 4, suit: "Spade" },
      { rank: 3, suit: "Club" },
      { rank: 3, suit: "Diamond" },
      { rank: 5, suit: "Club" },
      { rank: 6, suit: "Heart" },
      { rank: 7, suit: "Heart" },
      { rank: 8, suit: "Heart" },
      { rank: 12, suit: "Club" },
      { rank: 5, suit: "Spade" },
      { rank: 12, suit: "Diamond" },
    ],
    [
      { rank: 3, suit: "Spade" },
      { rank: 4, suit: "Club" },
      { rank: 2, suit: "Diamond" },
      { rank: 6, suit: "Club" },
      { rank: 7, suit: "Club" },
      { rank: 8, suit: "Club" },
      { rank: 9, suit: "Club" },
      { rank: 10, suit: "Club" },
      { rank: 6, suit: "Spade" },
      { rank: 13, suit: "Diamond" },
    ],
    [
      { rank: 2, suit: "Spade" },
      { rank: 5, suit: "Club" },
      { rank: 1, suit: "Spade" },
      { rank: 13, suit: "Spade" },
      { rank: 12, suit: "Spade" },
      { rank: 10, suit: "Spade" },
      { rank: 9, suit: "Spade" },
      { rank: 8, suit: "Spade" },
      { rank: 7, suit: "Spade" },
      { rank: 1, suit: "Diamond" },
    ],
    [
      { rank: 0, suit: "Joker" },
      { rank: 6, suit: "Club" },
      { rank: 7, suit: "Club" },
      { rank: 8, suit: "Club" },
      { rank: 9, suit: "Club" },
      { rank: 10, suit: "Club" },
      { rank: 12, suit: "Club" },
      { rank: 13, suit: "Club" },
      { rank: 1, suit: "Club" },
      { rank: 0, suit: "Joker" },
    ],
  ] as const;

  const [chips, setChips] = useState(
    Array(boardPattern.flat().length).fill(null)
  );
  const [turn, setTurn] = useState(true);

  function placeChip(index: number) {
    setChips((prevChips) => {
      if (prevChips[index] !== null) return prevChips;
      const newChips = [...prevChips];
      newChips[index] = turn
        ? "bg-gradient-to-br from-orange-600 to-orange-400"
        : "bg-gradient-to-br from-green-800 to-green-600";

      return newChips;
    });
    setTurn((prevTurn) => !prevTurn);
  }

  return (
    <div className="bg-gradient-to-b from-blue-950 to-blue-800 flex-1 m-2 rounded-sm p-2 grid grid-cols-10 grid-rows-10 gap-2">
      {boardPattern.flat().map((card, index) => {
        const { rank, suit } = card;
        return (
          <div
            className="relative h-full w-full cursor-pointer flex justify-center items-center"
            key={index}
            onClick={() => placeChip(index)}
          >
            {chips[index] && (
              <div
                className={`absolute  text-xl h-7 w-7 rounded-full z-10
                            ${chips[index]}`}
              ></div>
            )}
            <PlayingCard rank={rank} suit={suit} />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
