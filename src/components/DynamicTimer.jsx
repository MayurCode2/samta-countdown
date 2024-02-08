// DynamicTimer.jsx
import React, { useState, useRef, useEffect } from 'react';
import './DynamicTimer.css';

function DynamicTimer() {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [timerEnded, setTimerEnded] = useState(false);
  const intervalRef = useRef();
  const [ringColor, setRingColor] = useState("#4CAF50"); // Initialize ring color to green

  useEffect(() => {
    if (timerOn && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
        if (time <= 10 && ringColor !== "red") {
          setRingColor("red");
        }
      }, 1000);
    } else if (time === 0) {
      setTimerEnded(true);
      setTimerOn(false);
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerOn, time, ringColor]);

  const startTimer = () => {
    if (inputTime && !timerOn) {
      setTime(parseInt(inputTime));
      setTimerOn(true);
      setTimerEnded(false);
      setRingColor("#4CAF50"); // Reset ring color to green when starting timer
    }
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setTimerOn(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerOn(false);
    setTime(0);
    setInputTime('');
    setTimerEnded(false);
    setRingColor("#4CAF50"); // Reset ring color to green
  };

  const handleChange = e => {
    setInputTime(e.target.value);
  };

  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return ((inputTime - time) / inputTime) * 100;
  };

  return (
    <div className="dynamic-timer-container">
      <h1 className="dynamic-timer-header">Dynamic Timer</h1>
      <div className={`ring ${timerOn && 'ring-animation'}`} style={{ borderColor: ringColor }}>
        <svg className="progress-ring" width="200" height="200">
          <circle
            className="progress-ring__circle"
            stroke={ringColor}
            strokeWidth="8"
            fill="transparent"
            r="80"
            cx="100"
            cy="100"
            style={{
              strokeDasharray: 502,
              strokeDashoffset: 502 * (1 - calculateProgress() / 100)
            }}
          />
          <text
            x="100"
            y="100"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="20"
            fill="#000"
            transform={`rotate(0 100 100)`}
          >
            {time}
          </text>
        </svg>
      </div>
      <input
        className="time-input"
        type="text"
        placeholder="Enter time in seconds"
        value={inputTime}
        onChange={handleChange}
        disabled={timerOn}
      />
      {!timerOn ? (
        <button className="start-button" onClick={startTimer}>Start</button>
      ) : (
        <>
          <button className="stop-button" onClick={stopTimer}>Pause</button>
          <button className="reset-button" onClick={resetTimer}>Reset</button>
        </>
      )}
      <p className="current-time">Current Time: {formatTime(time)}</p>
      {timerEnded && <p className="timer-ended">Time's up!</p>}
    </div>
  );
}

export default DynamicTimer;
