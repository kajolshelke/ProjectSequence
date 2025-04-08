import { GlobalErrorContext } from "../contexts/ErrorContext";
import { useContext } from "react";
import { MdCancel } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";

const ErrorToast = () => {
  const { error, setError } = useContext(GlobalErrorContext);

  return (
    <div className="fixed bottom-28 right-0 w-[25%] h-[12%] bg-white  rounded-md mr-10 duration-300 shadow-md">
      <div className="w-full bg-red-700 rounded-t-md px-2 py-1 flex items-center justify-between text-white font-semibold tracking-wide">
        <p className="flex items-center text-lg">
          <FaExclamation className="text-sm mr-1" />
          Error
        </p>
        <MdCancel
          className=" text-lg cursor-pointer text-white"
          onClick={() => setError("")}
        />
      </div>
      <div className="px-2 py-1 w-full tracking-wide font-sm ">{error}</div>
    </div>
  );
};

export default ErrorToast;
