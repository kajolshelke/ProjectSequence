const PlayGameOverSound = () => {
  const gameOverSound = new Audio("/sounds/gameOverSound.mp3");

  gameOverSound.play();
};

export default PlayGameOverSound;
