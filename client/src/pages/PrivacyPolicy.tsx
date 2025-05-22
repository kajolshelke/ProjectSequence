import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
          Privacy Policy
        </h1>
        <div className="border-t-2 border-blue-950 pt-2 text-sm">
          <p>Effective Date: 22/05/2025</p>
          <p className="mb-10 border-b-2 border-blue-950 pb-2">
            We respect your privacy and are committed to being transparent about
            how your data is handled when using our online Sequence board game.
          </p>
          <ol>
            <li className="mb-5">
              <h2 className="text-lg"> 1. No Personal Data Collection</h2>
              <p>
                We do not collect any personal data. No account registration,
                login, or identity verification is required to use the Game.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 2. No Cookies from Us</h2>
              <p>
                We do not use cookies, local storage, or any tracking
                technologies to store user information or game data. All
                game-related data is temporary and only lasts during your
                session.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 3. Room Links</h2>
              <p>
                Rooms are created with unique links. These links are only shared
                by users and are not logged or tracked by us.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg">
                {" "}
                4. Third-Party Advertising (Google AdSense)
              </h2>
              <p>
                We use Google AdSense to display advertisements within the game.
                While we do not use cookies, Google and its partners may use
                cookies or other tracking technologies to personalize ads and
                measure their effectiveness. <br />
                You can learn how Google uses this data and how to opt out here:{" "}
                <br />
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  className="underline hover:text-blue-700"
                >
                  How Google uses information from sites
                </a>
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 5. External Links</h2>
              <p>
                Our game may display ads or contain links that lead to
                third-party websites. We are not responsible for their privacy
                practices or content.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 6. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any updates
                will be posted here with a new effective date.
              </p>
            </li>
            <li className="mb-5">
              <h2 className="text-lg"> 7. Contact</h2>
              <p>
                For any questions or concerns about this Privacy Policy, please
                contact the developer directly via the provided support channel
                -{" "}
                <a
                  href="mailto:sequencess25@gmail.com"
                  className="underline hover:text-blue-700"
                >
                  sequencess25@gmail.com
                </a>
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

export default PrivacyPolicy;
