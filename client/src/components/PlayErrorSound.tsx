const PlayErrorSound = () => {
  const errorSound = new Audio("/sounds/errorSound.mp3");
  errorSound.play();
};

export default PlayErrorSound;
