import React, { useState, useEffect, useRef, useMemo } from "react";
import { DealTimer } from "../../types/deals";

function timerToMilliseconds(timer: DealTimer): number {
  return (
    timer.days * 86_400_000 +
    timer.hours * 3_600_000 +
    timer.minutes * 60_000 +
    timer.seconds * 1_000
  );
}

function formatExpirationTime(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

interface CountdownTimerProps {
  timer: DealTimer;
  className?: string;
  textColor?: string;
  onTimerEnd?: () => void;
  showEndTime?: boolean;
  endTimePrefix?: string;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  locale?: string;
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
  textColor = "text-blue-600",
  onTimerEnd,
  showEndTime = false,
  endTimePrefix = "Ends at",
  labels = {
    days: "Day",
    hours: "Hrs",
    minutes: "Mins",
    seconds: "Secs",
  },
  locale = "en",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timer);
  const expirationTimeRef = useRef(Date.now() + timerToMilliseconds(timer));

  useEffect(() => {
    expirationTimeRef.current = Date.now() + timerToMilliseconds(timer);
    setTimeLeft(timer);
  }, [timer.days, timer.hours, timer.minutes, timer.seconds]);

  const formattedEndTime = useMemo(
    () => formatExpirationTime(expirationTimeRef.current, locale),
    [timer.days, timer.hours, timer.minutes, timer.seconds, locale]
  );

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
    return num.toLocaleString(locale, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  };

  const segments = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds },
  ];

  return (
    <div className={`flex flex-col items-end shrink-0 ${className}`}>
      <div className="flex items-center">
        {segments.map(({ value }, index) => (
          <React.Fragment key={index}>
            <span className={`text-base font-bold tabular-nums ${textColor}`}>
              {formatNumber(value)}
            </span>
            {index < segments.length - 1 && (
              <span className={`text-base font-bold mx-0.5 ${textColor}`}>:</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center mt-0.5">
        {segments.map(({ label }, index) => (
          <React.Fragment key={index}>
            <span className="text-[9px] text-gray-400 w-[26px] text-center">{label}</span>
            {index < segments.length - 1 && (
              <span className="text-[9px] text-transparent mx-0.5 w-[4px]">:</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {showEndTime && (
        <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
          {endTimePrefix} {formattedEndTime}
        </span>
      )}
    </div>
  );
}

export function CompactCountdownTimer({
  timer,
  className = "",
  textColor = "text-gray-600",
  labels = {
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
  },
  locale = "en",
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
        {timeLeft.days > 0 &&
          `${timeLeft.days.toLocaleString(locale)}${labels.days} `}
        {timeLeft.hours.toLocaleString(locale, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        :
        {timeLeft.minutes.toLocaleString(locale, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        :
        {timeLeft.seconds.toLocaleString(locale, {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </div>
    </div>
  );
}
