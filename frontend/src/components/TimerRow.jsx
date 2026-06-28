import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiMoreVertical } from 'react-icons/fi';

const TimerRow = ({ id, title, initialSeconds = 0, isActive, onToggle }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatSeconds = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    let res = '';
    if (hrs > 0) {
      res += `${hrs}h `;
    }
    if (mins > 0 || hrs > 0) {
      res += `${mins}m `;
    }
    res += `${secs}s`;
    return res;
  };

  return (
    <div className={`timer-row ${isActive ? 'active' : ''}`}>
      <div className="timer-left">
        <button 
          className="timer-play-btn" 
          onClick={() => onToggle(id)}
          title={isActive ? 'Pause Timer' : 'Start Timer'}
        >
          {isActive ? <FiPause size={12} /> : <FiPlay size={12} />}
        </button>
        <span className="timer-title">{title}</span>
      </div>
      <div className="timer-right">
        <span className="timer-duration">{formatSeconds(seconds)}</span>
        <FiMoreVertical 
          className="widget-actions-icon" 
          onClick={() => alert('Timer actions menu opened!')} 
        />
      </div>
    </div>
  );
};

export default TimerRow;
