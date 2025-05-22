import { Link } from "react-router-dom";

const TOS = () => {
  return (
    <div
      className="w-screen h-screen bg-gradient-to-b from-blue-300 to-red-50 p-3 tracking-wide flex justify-center overflow-y-auto [&::-webkit-scrollbar]:w-[10px]
                    [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-gray-500/80
                    [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-blue-950"
    >
      <div className="w-[90%] text-blue-900 font-medium">
        <h1 className="text-center mt-3 mb-3 text-xl font-semibold text-blue-950">
          Terms Of Use
        </h1>
        <div className="border-t-2 border-blue-950 pt-2 text-sm">
          <p>Effective Date: 22/05/2025</p>
          <p className="mb-10 border-b-2 border-blue-950 pb-2">
            Welcome to the online version of the Sequence board game. By
            accessing or using the Game, you agree to be bound by these Terms of
            Use. If you do not agree to these terms, please do not use the Game.
          </p>
          <ol>
            <li className="mb-5">
              <h2 className="text-lg"> 1. Use of the Game</h2>
              <p>
                This Game is provided solely for personal and non-commercial
                entertainment. You must use the Game in compliance with all
                applicable laws and must not use it in any manner that could
                harm others or disrupt the Game experience.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 2. No Account Required</h2>
              <p>
                This Game does not require you to sign up or create an account.
                You may create or join a game room using a shareable link
                without providing any personal information.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 3. Game Rooms</h2>
              <p>
                Each game room is accessible via a unique URL. Anyone with this
                link can join the room. Please do not share the link with
                individuals you do not wish to include in your game.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 4. Intellectual Property</h2>
              <p>
                All content, design, and logic of the Game are the property of
                the developer. Unauthorized copying, modification, or
                distribution of the Game or its assets is prohibited.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 5. Limitation of Liability</h2>
              <p>
                The Game is provided “as is” without warranties of any kind. We
                are not liable for any loss, damage, or inconvenience resulting
                from the use or inability to use the Game.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate access to the Game
                at our discretion and without notice, particularly in cases of
                misuse.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 7. Changes to Terms</h2>
              <p>
                These Terms may be updated occasionally. Continued use of the
                Game after changes implies acceptance of the updated Terms.
              </p>
            </li>
          </ol>
          <div className="flex items-center justify-end p-1 ">
            <Link
              to="/"
              className="px-3 py-1 bg-orange-500 text-white rounded-md cursor-pointer hover:bg-orange-400"
            >
              BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TOS;
