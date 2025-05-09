import PlayingCard from "./PlayingCard";
import socket from "../socket/socket";
import { useSearchParams } from "react-router-dom";
import { events } from "../events/events";
import PlayChipSound from "./PlayChipSound";

const GameBoard = ({
  selectedCardFromHand,
  boardPattern,
  formedSequenceList,
  playerTeam,
  moveCardOnBoard,
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
  playerTeam: "A" | "B" | "C";
  moveCardOnBoard: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
  };
}) => {
  const [params, _] = useSearchParams();
  const roomID = params.get("roomID");
  const playerID = localStorage.getItem("playerID");

  function handleMove(
    rank: number,
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker",
    deck: 0 | 1 | null
  ) {
    if (deck !== null) {
      socket.emit(
        events.playerMove.name,
        playerID,
        roomID,
        selectedCardFromHand,
        {
          rank,
          suit,
          deck,
        }
      );
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
        if (
          formedSequenceList
            .flat()
            .filter(
              (x) =>
                x.rank === card.rank &&
                x.suit === card.suit &&
                x.deck === card.deck
            ).length === 0
        ) {
          if (card.team !== null && card.team !== playerTeam) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
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

  function checkSequence(
    rank: number,
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker",
    deck: 0 | 1 | null
  ) {
    if (
      formedSequenceList
        .flat()
        .filter((x) => x.rank === rank && x.suit === suit && x.deck === deck)
        .length === 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  function toHighlightMoveCard(card: {
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
  }) {
    if (
      card.rank === moveCardOnBoard?.rank &&
      card.suit === moveCardOnBoard.suit &&
      card.deck === moveCardOnBoard.deck
    ) {
      return true;
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
            className={`relative h-full w-full cursor-pointer flex justify-center items-center `}
            key={index}
            onClick={() => handleMove(card.rank, card.suit, card.deck)}
          >
            <PlayingCard
              team={card.team}
              rank={rank}
              suit={suit}
              enabled={enableCard(card)}
              sequenceCard={checkSequence(card.rank, card.suit, card.deck)}
              highlightMoveCard={toHighlightMoveCard(card)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
