const ScreenSizeWarning = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-screen h-screen flex justify-center items-center fixed top-0 right-0 left-0 bottom-0">
      <div className="bg-gradient-to-b to-blue-300 from-blue-900 h-[40vh] w-[80vw] p-4 rounded-md text-white font-medium flex flex-col justify-center items-center">
        <h1 className="text-[16px] text-center tracking-wider">
          This game is best experienced on a larger screen.
        </h1>
        <button
          onClick={onClose}
          className="px-3 py-1 mt-4 text-sm bg-orange-500 rounded-md cursor-pointer hover:bg-orange-400"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;
