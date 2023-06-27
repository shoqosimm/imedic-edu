import { useState, useEffect, memo } from "react";

const Countdown = ({ minutes, onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (!timeLeft) {
      onCountdownEnd();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div>
      <p>
        {hours}h: {mins}m: {secs}s
      </p>
    </div>
  );
};

export default memo(Countdown);
