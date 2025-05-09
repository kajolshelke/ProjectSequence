import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import PlayGameOverSound from "./PlayGameOverSound";

const WinState = ({ winState }: { winState: "A" | "B" | "C" | "TIE" }) => {
  useEffect(() => {
    PlayGameOverSound();
  }, []);
  return createPortal(
    <div
      className={`absolute z-100  left-0 right-0 top-0 bottom-0
                   bg-gray-400/70 flex justify-center items-center
                   transition-all duration-300 ease-out
                   ${winState ? "opacity-100 scale-100" : "hidden"}`}
    >
      <div className="w-[50%] h-[25%] px-10 py-10 rounded-md  bg-gradient-to-b from-blue-950 to-blue-800 text-white flex flex-col justify-between items-center ">
        {winState === "A" ? (
          <p className="font-semibold text-lg tracking-wider">
            Game over - Team A takes victory!
          </p>
        ) : winState === "B" ? (
          <p className="font-semibold text-lg tracking-wider">
            Game over - Team B takes victory!
          </p>
        ) : winState === "C" ? (
          <p className="font-semibold text-lg tracking-wider">
            Game over - Team C takes victory!
          </p>
        ) : winState === "TIE" ? (
          <p className="font-semibold text-lg tracking-wider">
            Game over - It's a tie!
          </p>
        ) : (
          ""
        )}
        <Link
          to="/"
          className="px-3 py-2 bg-gradient-to-br font-medium tracking-wide from-orange-600 to-orange-400 rounded-md cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400"
        >
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>,
    document.getElementById("portal")!
  );
};

export default WinState;
