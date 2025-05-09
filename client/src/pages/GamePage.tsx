import { useEffect, useRef, useState, useContext } from "react";
import socket from "../socket/socket";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import PlayerPanel from "../components/PlayerPanel";
import { boardPattern } from "../gameBoardPattern/boardPattern.js";
import emitterRoomDestroy from "../controllers/emitters/emitterRoomDestroy.js";
import { events } from "../events/events.js";
import WinState from "../components/WinState.js";
import PlayChipSound from "../components/PlayChipSound.js";
import { GlobalErrorContext } from "../contexts/ErrorContext.js";
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
  const [playerTeam, setPlayerTeam] = useState<"A" | "B" | "C">("A");
  const [winState, setWinState] = useState<null | "A" | "B" | "C" | "TIE">(
    null
  );
  const [moveCardOnBoard, setMoveCardOnBoard] = useState<{
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
    deck: 0 | 1 | null;
  } | null>();

  const { setError } = useContext(GlobalErrorContext);

  useEffect(() => {
    const isReloaded = sessionStorage.getItem("game-page-reload");

    if (isReloaded) {
      // runs on refresh of page
      emitterRoomDestroy(roomID);
      navigate("/");
    } else {
      // runs on initial load of page
      sessionStorage.setItem("game-page-reload", "true");
      socket.emit(events.playerFirstHand.name, playerID, roomID);
    }
  }, []);

  useEffect(() => {
    socket.on(
      events.playerFirstHand.name,
      (
        firstPlayerName,
        firstPlayerTeam,
        firstPlayerID,
        handState,
        playerTeam,
        drawDeckLength,
        duration
      ) => {
        setHand(handState);
        setNoOfCardsLeftInDrawDeck(drawDeckLength);
        setNextPlayerName(firstPlayerName);
        setNextPlayerTeam(firstPlayerTeam);
        setPlayerTimeRemaining(duration);
        setNextPlayerID(firstPlayerID);
        setPlayerTeam(playerTeam);
      }
    );

    socket.on(
      events.playerMove.name,
      (
        newBoardState: boardPatternProp[],
        sequenceList: sequenceListProp[][],
        nextPlayerID: string,
        nextPlayerName: string,
        nextPlayerTeam: string,
        drawDeckLength: number,
        duration: number,
        winState: null | "A" | "B" | "C" | "TIE",
        moveCardOnBoard: {
          rank: number;
          suit: "Heart" | "Spade" | "Club" | "Diamond" | "Joker";
          deck: 0 | 1 | null;
        } | null
      ) => {
        setBoardState(newBoardState);
        setFormedSequenceList(sequenceList);
        setNextPlayerName(nextPlayerName);
        setNextPlayerTeam(nextPlayerTeam);
        setSelectedCardFromHand(undefined);
        setNoOfCardsLeftInDrawDeck(drawDeckLength);
        setNextPlayerID(nextPlayerID);
        setPlayerTimeRemaining(duration);
        setWinState(winState);
        setMoveCardOnBoard(moveCardOnBoard);
        if (moveCardOnBoard !== null) {
          PlayChipSound();
        }
      }
    );

    socket.on(events.playerHandUpdate.name, (playerHandAfterMove) => {
      setHand(playerHandAfterMove);
    });

    socket.on(events.userError.name, (userError) => {
      setError(userError);
    });

    return () => {
      socket.off(events.playerFirstHand.name);
      socket.off(events.playerMove.name);
      socket.off(events.playerHandUpdate.name);
      socket.off(events.userError.name);
    };
  }, [socket]);

  const [selectedCardFromHand, setSelectedCardFromHand] = useState<{
    rank: number;
    suit: "Heart" | "Spade" | "Club" | "Diamond";
  }>();
  const [noOfCardsLeftInDrawDeck, setNoOfCardsLeftInDrawDeck] =
    useState<number>(104);

  const [playerTimeRemaining, setPlayerTimeRemaining] = useState<number>(0);

  const timerTickingSoundRef = useRef<HTMLAudioElement | null>(null);
  const timerEndSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    timerTickingSoundRef.current = new Audio("/sounds/timerTickingSound.mp3");
    timerTickingSoundRef.current.volume = 0.3;

    timerEndSoundRef.current = new Audio("/sounds/timerEndSound.mp3");
    timerEndSoundRef.current.volume = 0.6;
  }, []);
  useEffect(() => {
    let timer = -1;
    if (winState !== null) {
      if (timer !== -1) {
        clearInterval(timer);
      }
    } else {
      if (nextPlayerID === playerID) {
        timer = setInterval(() => {
          if (playerTimeRemaining > 1000) {
            timerTickingSoundRef.current?.play();
            setPlayerTimeRemaining(playerTimeRemaining - 1000);
          } else {
            timerEndSoundRef.current?.play();
            clearInterval(timer);
            socket.emit(events.playerMove.name, playerID, roomID, null, null);
          }
        }, 1000);
      }
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
          playerTeam={playerTeam}
          moveCardOnBoard={moveCardOnBoard!}
        />
      </div>
      <div className="w-[25%] flex flex-col items-center justify-center p-2">
        <PlayerPanel
          selectedCardFromHand={selectedCardFromHand}
          setSelectedCardFromHand={setSelectedCardFromHand}
          hand={hand}
          nextPlayerName={nextPlayerName}
          nextPlayerTeam={nextPlayerTeam}
          noOfCardsLeftInDrawDeck={noOfCardsLeftInDrawDeck}
          playerTimeRemaining={playerTimeRemaining}
        />
      </div>
      {winState && <WinState winState={winState} />}
    </div>
  );
};

export default GamePage;
