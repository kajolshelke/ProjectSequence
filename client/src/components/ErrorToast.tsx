import { GlobalErrorContext } from "../contexts/ErrorContext";
import { useContext, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import PlayErrorSound from "./PlayErrorSound";

const ErrorToast = () => {
  const { error, setError } = useContext(GlobalErrorContext);

  useEffect(() => {
    if (error.length > 0) {
      PlayErrorSound();
    }
  }, [error]);

  return (
    <div
      className={
        error.length !== 0
          ? "fixed top-2 right-0 w-[25%] h-[12%] bg-white  rounded-md mr-2 duration-300 shadow-md"
          : "fixed top-2 right-[-35em] w-[25%] h-[12%] bg-white  rounded-md mr-2 duration-300 shadow-md"
      }
    >
      <div className="w-full bg-gradient-to-br from-blue-800 to-blue-400 rounded-t-md px-2 py-1 flex items-center justify-between text-white font-semibold tracking-wide">
        <p className="flex items-center text-lg">
          Error
          <FaExclamation className="text-sm" />
        </p>
        <MdCancel
          className=" text-lg cursor-pointer text-white"
          onClick={() => setError("")}
        />
      </div>
      <div className="px-2 py-1 w-full tracking-wide font-sm text-sm ">
        {error}
      </div>
    </div>
  );
};

export default ErrorToast;
