import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b to-red-50 from-blue-300 flex-col">
      <h1 className="p-2 tracking-widest text-5xl font-bold text-blue-950 mb-5">
        SEQUENCE
      </h1>
      <h1 className="text-xl font-semibold tracking-wide text-blue-950">
        It Looks Like The Page You Are Looking For Doesn't Exist
      </h1>
      <p className="mb-10 font-medium tracking-wide text-blue-950 mt-2">
        404 | Page Not Found
      </p>
      <Link
        to="/"
        className="outline-none border-none px-5 py-2 text-sm tracking-wide text-white font-medium rounded-md bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400"
      >
        Go Back
      </Link>
    </div>
  );
};

export default NotFound;
