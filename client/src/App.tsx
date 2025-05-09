import "./App.css";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";
import socket from "./socket/socket";
import { useEffect, useState } from "react";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import ErrorToast from "./components/ErrorToast";
import GlobalErrorProvider from "./contexts/ErrorContext";
import GameBoard from "./components/GameBoard";
import CardDeck from "./components/CardDeck";
import HandCard from "./components/HandCard";
import GamePage from "./pages/GamePage";
import WinState from "./components/WinState";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/create",
    element: <CreateRoomPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/join",
    element: <JoinRoomPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/ongoing",
    element: <GamePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <GlobalErrorProvider>
      <div className="w-[100vw] h-[100vh] font-montserrat bg-gray-300 overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </GlobalErrorProvider>
  );
}

export default App;
