import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }

    // window.myTimer = setInterval(() => {
    //   setTimer((timer) => timer + 1);
    // }, 1000);
  };
  const stopTimer = () => {
    setIsRunning(false);
    // clearInterval(window.myTimer);
  };
  const resetTimer = () => {
    // clearInterval(window.myTimer);
    setTimer(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  // format the time into MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes} mins ${seconds} secs`;
  };

  return (
    <div className="container">
      <h1>Timer</h1>
      {/* <span> {Math.trunc(timer / 60)} mins </span>
      <span> {timer % 60} secs</span> */}
      <span> {formatTime(timer)} </span>
      <div>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
