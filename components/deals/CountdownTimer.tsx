import React, { useState, useEffect } from "react";
import { DealTimer } from "../../types/deals";

export interface CountdownTimerLabels {
  days: string;
  hrs: string;
  mins: string;
  secs: string;
}

interface CountdownTimerProps {
  timer: DealTimer;
  className?: string;
  textColor?: string;
  onTimerEnd?: () => void;
  /** Optional labels for Days, Hrs, Mins, Secs (e.g. for i18n) */
  labels?: CountdownTimerLabels;
  /** Smaller text on mobile when "sm" */
  size?: "sm" | "md";
}

const DEFAULT_LABELS: CountdownTimerLabels = {
  days: "Days",
  hrs: "Hrs",
  mins: "Mins",
  secs: "Secs",
};

export default function CountdownTimer({
  timer,
  className = "",
  textColor = "text-gray-600",
  onTimerEnd,
  labels: customLabels,
  size = "md",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timer);
  const labels = customLabels ?? DEFAULT_LABELS;
  const valueClass = size === "sm" ? "text-sm font-bold" : "text-sm md:text-xl font-bold";
  const labelClass = size === "sm" ? "text-[10px] text-gray-500" : "text-[10px] md:text-xs text-gray-500";

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
        { value: timeLeft.days, label: labels.days },
        { value: timeLeft.hours, label: labels.hrs },
        { value: timeLeft.minutes, label: labels.mins },
        { value: timeLeft.seconds, label: labels.secs },
      ].map(({ value, label }, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className={`${valueClass} ${textColor}`}>
            {formatNumber(value)}
          </span>
          <span className={labelClass}>{label}</span>
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
