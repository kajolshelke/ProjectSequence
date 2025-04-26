import { useEffect, useState } from "react";
import socket from "../socket/socket";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import PlayerPanel from "../components/PlayerPanel";
import { boardPattern } from "../gameBoardPattern/boardPattern.js";
import emitterRoomDestroy from "../controllers/emitters/emitterRoomDestroy.js";

interface boardPatternProp {
  rank: number;
  suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
  deck: 0 | 1 | null;
  team: "A" | "B" | "C" | null;
}
interface sequenceListProp {
  rank: number;
  suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
  deck: 0 | 1 | null;
}

const GamePage = () => {
  const navigate = useNavigate();
  const [params, _] = useSearchParams();
  const roomID = params.get("roomID");
  const playerID = localStorage.getItem("playerID");

  const [hand, setHand] = useState([]);
  const [boardState, setBoardState] = useState(boardPattern);
  const [nextPlayerName, setNextPlayerName] = useState<string>("");
  const [nextPlayerTeam, setNextPlayerTeam] = useState<string>("");
  const [nextPlayerID, setNextPlayerID] = useState<string>("");
  const [formedSequenceList, setFormedSequenceList] = useState<
    sequenceListProp[][]
  >([]);

  useEffect(() => {
    const isReloaded = sessionStorage.getItem("game-page-reload");

    if (isReloaded) {
      // runs on refresh of page
      emitterRoomDestroy(roomID);
      navigate("/");
    } else {
      // runs on initial load of page
      sessionStorage.setItem("game-page-reload", "true");
      socket.emit("playerHand", playerID, roomID);
    }
  }, []);

  useEffect(() => {
    socket.on(
      "playerHandFirstUpdate",
      (
        playerHand,
        drawDeckLength,
        firstPLayerTurnName,
        firstPLayerTurnTeam,
        duration,
        firstPLayerTurnID
      ) => {
        setHand(playerHand);
        setNoOfCardsLeftInDrawDeck(drawDeckLength);
        setNextPlayerName(firstPLayerTurnName);
        setNextPlayerTeam(firstPLayerTurnTeam);
        setPlayerTimeRemaining(duration);
        setNextPlayerID(firstPLayerTurnID);
      }
    );

    socket.on(
      "gameStateUpdate",
      (
        newBoardState: boardPatternProp[],
        sequenceList: sequenceListProp[][],
        nextPlayerID: string,
        nextPlayerName: string,
        nextPlayerTeam: string,
        drawDeckLength: number,
        duration: number
      ) => {
        setBoardState(newBoardState);
        setFormedSequenceList(sequenceList);
        setNextPlayerName(nextPlayerName);
        setNextPlayerTeam(nextPlayerTeam);
        setSelectedCardFromHand(undefined);
        setNoOfCardsLeftInDrawDeck(drawDeckLength);
        setNextPlayerID(nextPlayerID);
        setPlayerTimeRemaining(duration);
      }
    );

    socket.on("playerHandUpdate", (playerHandAfterMove) => {
      setHand(playerHandAfterMove);
    });

    return () => {
      socket.off("playerHandFirstUpdate");
      socket.off("gameStateUpdate");
      socket.off("playerHandUpdate");
    };
  }, [socket]);

  const [selectedCardFromHand, setSelectedCardFromHand] = useState<{
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond";
  }>();
  const [noOfCardsLeftInDrawDeck, setNoOfCardsLeftInDrawDeck] =
    useState<number>(104);

  const [playerTimeRemaining, setPlayerTimeRemaining] = useState<number>(0);
  useEffect(() => {
    let timer = -1;
    if (nextPlayerID === playerID) {
      timer = setInterval(() => {
        if (playerTimeRemaining > 1000) {
          setPlayerTimeRemaining(playerTimeRemaining - 1000);
        } else {
          clearInterval(timer);
          socket.emit("playerMadeMove", playerID, roomID, null, null);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [playerTimeRemaining, nextPlayerID]);

  return (
    <div className="flex h-screen w-screen bg-gradient-to-b to-white from-blue-300">
      <div className="w-[75%] p-2  ">
        <GameBoard
          selectedCardFromHand={selectedCardFromHand}
          boardPattern={boardState}
          formedSequenceList={formedSequenceList}
        />
      </div>
      <div className="w-[25%] flex flex-col items-center justify-center p-2">
        <PlayerPanel
          setSelectedCardFromHand={setSelectedCardFromHand}
          hand={hand}
          nextPlayerName={nextPlayerName}
          nextPlayerTeam={nextPlayerTeam}
          noOfCardsLeftInDrawDeck={noOfCardsLeftInDrawDeck}
          playerTimeRemaining={playerTimeRemaining}
        />
      </div>
    </div>
  );
};

export default GamePage;
