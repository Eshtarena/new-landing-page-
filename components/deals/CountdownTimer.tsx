import React, { useState, useEffect } from "react";
import { DealTimer } from "../../types/deals";

interface CountdownTimerProps {
  timer: DealTimer;
  className?: string;
  textColor?: string;
  onTimerEnd?: () => void;
}

export default function CountdownTimer({
  timer,
  className = "",
  textColor = "text-gray-600",
  onTimerEnd,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer ended
          if (onTimerEnd) {
            onTimerEnd();
          }
          clearInterval(interval);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimerEnd]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className={`flex flex-row items-center space-x-3 ${className}`}>
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hrs" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map(({ value, label }, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className={`text-xl font-bold ${textColor}`}>
            {formatNumber(value)}
          </span>
          <span className={`text-xs text-gray-500`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// Alternative compact layout for smaller spaces
export function CompactCountdownTimer({
  timer,
  className = "",
  textColor = "text-gray-600",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${className}`}>
      <div className={`text-sm font-mono ${textColor}`}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </div>
    </div>
  );
}
