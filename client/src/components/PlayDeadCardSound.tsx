const PlayDeadCardSound = () => {
  const deadCardSound = new Audio("/sounds/deadCardSound.mp3");
  deadCardSound.play();
};

export default PlayDeadCardSound;
