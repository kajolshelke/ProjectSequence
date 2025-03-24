import { useState } from "react";

import PlayingCard from "./PlayingCard";

interface DeckCard {
  rank: number;
  suit: "Heart" | "Spade" | "Diamond" | "Club";
}

const suits = ["Heart", "Spade", "Diamond", "Club"] as const;

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Creating deck
function createDeck() {
  let deck: DeckCard[] = [];

  suits.forEach((suit) => {
    numbers.forEach((rank) => {
      deck.push({ suit, rank });
    });
  });

  return deck;
}

const CardDeck = () => {
  const [players, setPlayers] = useState<DeckCard[][]>([]);
  const noOfPlayers = 4;
  const cardsPerPlayer = 5;

  //   Shuffling deck
  function shuffleDeck(deck: DeckCard[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  const [deck, setDeck] = useState<DeckCard[]>(() =>
    shuffleDeck([...createDeck(), ...createDeck()])
  );
  // Deal cards
  function dealCards() {
    console.log(deck.length);

    let distributedPlayers = [];

    for (let i = 0; i < noOfPlayers; i++) {
      distributedPlayers.push(deck.splice(0, cardsPerPlayer));
      console.log(deck.length);
    }
    setPlayers(distributedPlayers);
  }

  const [discardCard, setDiscardCard] = useState<{
    playerIndex: number;
    cardIndex: number;
  }>({ playerIndex: -1, cardIndex: -1 });

  function handleCardDiscard(playerIndex: number, cardIndex: number) {
    setDiscardCard((prev) =>
      prev?.playerIndex === playerIndex && prev?.cardIndex === cardIndex
        ? { playerIndex: -1, cardIndex: -1 }
        : { playerIndex, cardIndex }
    );
  }

  function useCard(playerIndex: number) {
    if (discardCard && discardCard.playerIndex === playerIndex) {
      setPlayers((prev) =>
        prev.map((hand, i) =>
          i === playerIndex
            ? [
                ...hand.slice(0, discardCard.cardIndex),
                ...(deck.length > 0 ? deck.slice(0, 1) : []),
                ...hand.slice(discardCard.cardIndex + 1),
              ]
            : hand
        )
      );
      setDeck((prev) => (prev.length > 0 ? prev.slice(1) : prev));
      setDiscardCard({ playerIndex: -1, cardIndex: -1 });
    }
  }
  return (
    <div className="w-screen p-4">
      <button
        onClick={dealCards}
        className="px-2 py-1 cursor-pointer bg-blue-700 rounded-sm text-white"
      >
        {deck.length}
      </button>

      {players.length > 0 &&
        players.map((player, index) => (
          <div key={index}>
            <h3 className="text-lg font-bold">Player {index + 1}</h3>
            <div className="flex gap-2 items-center ">
              {player.map((card, idx) => (
                <div
                  key={idx}
                  className={`w-36  h-24 border rounded shadow-md flex items-center justify-center bg-blue-300 cursor-pointer
                                ${
                                  discardCard?.playerIndex === index &&
                                  discardCard?.cardIndex === idx
                                    ? "border-blue-800 border-2"
                                    : "border"
                                }`}
                  onClick={() => handleCardDiscard(index, idx)}
                >
                  <PlayingCard rank={card.rank} suit={card.suit} />
                </div>
              ))}
              <div className="flex gap-2 ">
                <button
                  onClick={() => useCard(index)}
                  className="w-full cursor-pointer px-2 py-1  bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-sm"
                >
                  USE CARD
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CardDeck;
