export const playAlertSound = () => {
  try {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0Y...",
    );
    audio.play();
  } catch (error) {
    console.log("Sound not available");
  }
};
