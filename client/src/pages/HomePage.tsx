import { IoPeople } from "react-icons/io5";
import { IoMdCreate } from "react-icons/io";
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Rules from "../components/Rules";
import { useContext } from "react";
import { GlobalErrorContext } from "../contexts/ErrorContext";

import ScreenSizeWarning from "../components/ScreenSizeWarning";
import socket from "../socket/socket";
import { events } from "../events/events";

const HomePage = () => {
  // Screen Size Prompt
  const MIN_WIDTH = 1024;
  const MIN_HEIGHT = 500;

  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT) {
        setPopup(true);
      } else {
        setPopup(false);
      }
    };

    const isFirstLoad = localStorage.getItem("home-first-load");

    if (!isFirstLoad) {
      handleResize();
      localStorage.setItem("home-first-load", "t");
    }
  }, []);

  //State For Nickname
  const [nickname, setNickname] = useState("");

  //Get url params
  const [params] = useSearchParams();
  const roomIDFromURL = params.get("roomID");

  const [viewRules, setViewRules] = useState(false);
  const { setError } = useContext(GlobalErrorContext);
  //Clear all the sessionStorage States
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    socket.on(events.roomCheck.name, (roomCheck: boolean) => {
      if (roomCheck) {
        navigate(`/join?name=${nickname}&roomID=${roomIDFromURL}`);
      } else {
        setError("Room doesn't exist");
      }
    });

    return () => {
      socket.off(events.roomCheck.name);
    };
  }, [nickname, roomIDFromURL]);

  function validateNickname() {
    if (nickname.length < 3) {
      setError("Nickname too short");
    } else if (nickname.length > 20) {
      setError("Nickname too long");
    }
  }

  const handleJoinClick = () => {
    if (nickname.length < 3) {
      setError("Nickname too short");
      return;
    }
    if (nickname.length > 20) {
      setError("Nickname too long");
      return;
    }

    socket.emit(events.roomCheck.name, roomIDFromURL);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b to-red-50 from-blue-300 flex flex-col items-center">
      <div className="animate-scaleUp w-full flex flex-col items-center justify-center">
        <div className=" p-4 text-center pt-20">
          <h1 className="p-2 tracking-widest text-5xl font-bold text-blue-950 inline-block max-w-max overflow-hidden whitespace-normal w-0 border-r-2 border-r-solid border-r-blue-950 animate-[var(--animate-typing),var(--animate-removeCursor)]">
            SEQUENCE
          </h1>
          <h3 className="text-xl mt-1 text-blue-950 font-medium tracking-wide">
            Connect the cards and claim the board!
          </h3>
        </div>
        <div className="text-center mt-12 flex flex-col justify-center items-center w-fit">
          <input
            type="text"
            maxLength={20}
            className="outline-none border-none rounded-md px-4 py-2 text-blue-500 font-medium text-center bg-blue-50 shadow-lg w-full placeholder:text-blue-500"
            value={nickname}
            placeholder="Enter Your Nickname"
            onChange={(e) => {
              setNickname(e.target.value);
            }}
          />
          <p className="text-xs font-medium tracking-wide mt-5 text-blue-950">
            Nickname must be 3-20 characters long and unique within the room.
          </p>

          <div className="mt-42 p-2 flex gap-10 m-auto w-full justify-center">
            {roomIDFromURL === null && (
              <Link
                to={
                  nickname.length >= 3 && nickname.length <= 20
                    ? `/create?name=${nickname}`
                    : "#"
                }
                className="py-1.5 outline-none font-medium rounded-md transition-all flex-1 bg-gradient-to-br from-blue-900 to-blue-500 cursor-pointer hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-400 flex items-center justify-center gap-2 text-white"
                onClick={() => validateNickname()}
              >
                <IoMdCreate className="text-lg " />
                Create Room
              </Link>
            )}
            {roomIDFromURL && (
              <button
                onClick={handleJoinClick}
                className="py-1.5 outline-none font-medium rounded-md transition-all flex-1 bg-gradient-to-br from-blue-900 to-blue-500 cursor-pointer hover:bg-gradient-to-br hover:from-blue-800 hover:to-blue-400 flex items-center justify-center gap-1 text-white"
              >
                <IoPeople className="text-lg relative right-2 " />
                Join Room
              </button>
            )}
          </div>
        </div>
        <div className=" text-center p-4 mt-10">
          <button
            onClick={() => setViewRules(true)}
            className="outline-none border-none px-3 py-2 tracking-wide text-white font-medium rounded-md bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400"
          >
            HOW TO PLAY?
          </button>
        </div>
      </div>
      {viewRules && <Rules onClose={() => setViewRules(false)} />}
      {popup && <ScreenSizeWarning onClose={() => setPopup(false)} />}
      <div className="flex-1"></div>

      <div className="w-full flex gap-4 items-center justify-end p-2 text-blue-950 text-xs  ">
        <a
          href="mailto:sequencess25@gmail.com"
          className="underline hover:text-blue-700"
        >
          Feedback
        </a>

        <Link to="/tos" className="underline hover:text-blue-700">
          Terms of Use
        </Link>
        <Link to="/privacy" className="underline hover:text-blue-700">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
