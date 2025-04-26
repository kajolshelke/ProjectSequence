import PlayingCard from "./PlayingCard";
import socket from "../socket/socket";
import { useSearchParams } from "react-router-dom";

const GameBoard = ({
  selectedCardFromHand,
  boardPattern,
  formedSequenceList,
}: {
  selectedCardFromHand?: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond";
  };
  boardPattern: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
    team: "A" | "B" | "C" | null;
  }[];
  formedSequenceList: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
  }[][];
}) => {
  const [params, _] = useSearchParams();
  const roomID = params.get("roomID");
  const id = localStorage.getItem("playerID");

  function handleMove(
    rank: number,
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker",
    deck: 0 | 1 | null
  ) {
    if (deck !== null) {
      socket.emit("playerMadeMove", id, roomID, selectedCardFromHand, {
        rank,
        suit,
        deck,
      });
    }
  }

  function enableCard(card: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
    team: "A" | "B" | "C" | null;
  }) {
    if (selectedCardFromHand && card.suit !== "Joker") {
      if (
        selectedCardFromHand.rank === 11 &&
        (selectedCardFromHand.suit === "Club" ||
          selectedCardFromHand.suit === "Spade")
      ) {
        return false;
      } else if (
        selectedCardFromHand.rank === 11 &&
        (selectedCardFromHand.suit === "Diamond" ||
          selectedCardFromHand.suit === "Heart")
      ) {
        if (
          boardPattern.filter(
            (x) =>
              x.rank === card.rank &&
              x.suit === card.suit &&
              x.deck === card.deck
          )[0].team
        ) {
          return false;
        } else {
          if (
            formedSequenceList
              .flat()
              .filter(
                (x) =>
                  x.rank === card.rank &&
                  x.suit === card.suit &&
                  x.deck === card.deck
              ).length !== 0
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (
          card.rank === selectedCardFromHand.rank &&
          card.suit === selectedCardFromHand.suit
        ) {
          if (
            boardPattern.filter(
              (x) =>
                x.rank === card.rank &&
                x.suit === card.suit &&
                x.deck === card.deck
            )[0].team
          ) {
            return false;
          } else {
            if (
              formedSequenceList
                .flat()
                .filter(
                  (x) =>
                    x.rank === card.rank &&
                    x.suit === card.suit &&
                    x.deck === card.deck
                ).length !== 0
            ) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  return (
    <div className="h-full bg-blue-950/10 flex-1 rounded-sm p-2 grid grid-cols-10 grid-rows-10 gap-2 shadow-gameboard">
      {boardPattern.map((card, index) => {
        const { rank, suit } = card;
        return (
          <div
            className={`relative h-full w-full cursor-pointer flex justify-center items-center`}
            key={index}
            onClick={() => handleMove(card.rank, card.suit, card.deck)}
          >
            <PlayingCard
              team={card.team}
              rank={rank}
              suit={suit}
              enabled={enableCard(card)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
