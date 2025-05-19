import { GoGoal } from "react-icons/go";
import { MdSmartDisplay } from "react-icons/md";

const Rules = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="bg-gray-300 fixed top-0 bottom-0 right-0 left-0 z-50 w-screen h-screen flex  items-center justify-center">
      <div className="bg-gradient-to-b from-blue-950/90 to-blue-900/90  text-white rounded-md h-[95%] w-[80%]  ">
        <div
          className=" w-full h-full p-4 leading-[30px] overflow-y-auto  [&::-webkit-scrollbar]:w-[6px]
                    [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-100/50
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-white
                  "
        >
          <div className="w-full flex items-center justify-center">
            <h1 className="text-center p-2 px-8 mb-3 text-2xl tracking-wider bg-gray-400/20 font-bold w-fit border border-blue-200 rounded-md  ">
              GAME RULES
            </h1>
          </div>

          {/* Overview */}
          <p className="px-4  mb-4 font-medium ">
            Sequence is a strategic multiplayer board game where players take
            turns playing cards to place chips on matching board spaces, with
            the goal of creating consecutive sequences.
          </p>

          {/* Objective */}
          <div className="px-4 mb-6 tracking-wide font-medium">
            <div className="flex items-center tracking-wide gap-2 bg-black/30 w-fit px-2 py-0.5 rounded-md mb-3">
              <GoGoal className="text-xl h-fit bg-white text-red-500 rounded-md" />
              <p className="font-semibold tracking-wider">OBJECTIVE</p>
            </div>
            <div className="">
              <div>
                The goal of the game is to be the first team to score 2
                sequences in a two-team game or 1 sequence in a three-team game.
                A sequence is 5 chips of same colour in a row either
                horizontally, vertically or diagonally.
              </div>
              <div className="bg-black/30 w-[50%] mt-3 max-w-[400px] p-2 flex justify-center items-center rounded-md">
                <img
                  src="/images/sequence.png"
                  alt="sequence image"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* GameSetup */}
          <div className="px-4 mb-4 tracking-wide font-medium">
            <div className="flex items-center tracking-wide gap-2 bg-black/30 w-fit px-2 py-0.5 rounded-md mb-3">
              <MdSmartDisplay className="text-xl bg-white  h-fit  text-orange-500 rounded-md " />
              <p className="font-semibold tracking-wider">GAMEPLAY</p>
            </div>

            <div>
              Sequence can be played with 2 to 12 players, in teams of 2 or 3.
              Each team uses a unique chip color. Two standard decks of cards
              are used, and each card appears twice on the board—except the
              Jacks. The number of cards dealt per player depends on the number
              of players.
              <div className="max-w-xl mt-3 mb-3 bg-black/30 rounded-md p-2 flex justify-center items-center">
                <img
                  src="/images/perPlayerCards.png"
                  alt="player-cards-table"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                The remaining cards form a draw deck. Each team plays in
                rotation.
                <ul className="list-disc pl-5">
                  <li>
                    On you turn, select one card from your hand and place a chip
                    on one corresponding unoccupied boardspace.{" "}
                  </li>
                  <li>
                    If both matching spaces on board are occupied, declare it as
                    a dead card,select it from the hand and add it to the
                    discard pile to get a replacement.{" "}
                    <div className="mb-3 bg-black/30 p-1 rounded-md  max-w-[250px]">
                      <img
                        src="/images/discard.png"
                        alt="discard card button"
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </li>

                  <li>
                    After playing a card, a new card is being drawn from the
                    draw deck and player hand is updated.
                  </li>
                  <li className="font-bold">
                    WILD CARDS
                    <div className="flex mt-1 mb-1 bg-white/30  p-2 gap-1 rounded-md w-fit">
                      <img
                        src="/images/redJack2.png"
                        alt="heart J"
                        className=" w-16 object-contain"
                      />
                      <img
                        src="/images/blackJack.png"
                        alt="spade J"
                        className=" w-16 object-contain"
                      />
                      <img
                        src="/images/redJack.png"
                        alt="diamond J"
                        className="w-16 object-contain"
                      />
                      <img
                        src="/images/blackJack2.png"
                        alt="club J"
                        className="w-16 object-contain"
                      />
                    </div>
                    <ul className="list-decimal pl-4 font-medium">
                      <li>
                        Red Jack: Use this card to place a chip on any
                        unoccupied card space on the gameboard.
                      </li>
                      <li>
                        Black Jack: Use this card to remove opponent team's chip
                        from the gameboard, the chip cannot be removed if the
                        card belongs to a formed seqeunce.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Seqeunces may share only one chip from another seqeunce of
                    the same colour.
                  </li>
                  <li>
                    Each corner of the board is a wild space that counts as one
                    chip for any player requiring only four chips for a
                    sequence. More than one team may use the same corner in a
                    sequence.{" "}
                    <div className="mt-1 mb-1 max-w-[350px] bg-black/30 p-2 rounded-md">
                      <img
                        src="/images/corner.png"
                        alt="corner wild space"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </li>
                  <li>
                    The first team to complete the required number of sequences
                    wins. If the draw deck runs out of cards before there is a
                    winner then the game ends in a TIE.{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between">
            <div></div>
            <button
              onClick={onClose}
              className=" text-sm tracking-wider px-4 py-2 font-semibold cursor-pointer rounded-sm bg-orange-500 hover:bg-orange-400"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
