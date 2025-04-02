import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b to-red-50 from-blue-300 flex-col">
      <h1 className="p-2 tracking-widest text-5xl font-bold text-blue-950 mb-5">
        SEQUENCE
      </h1>
      <h1 className="font-medium tracking-wide text-blue-950 mb-20">
        It Looks Like There Was An Error While Loading The Page
      </h1>
      <Link
        to="/"
        className="outline-none border-none px-5 py-2 text-sm tracking-wide text-white font-medium rounded-md bg-gradient-to-br from-orange-600 to-orange-400 cursor-pointer hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-400"
      >
        Go Back
      </Link>
    </div>
  );
};

export default ErrorPage;
