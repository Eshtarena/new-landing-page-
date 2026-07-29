import React, { useEffect, useRef, useState } from 'react';

interface ScrollingLabelProps {
  text: string;
  className?: string;
}

export default function ScrollingLabel({ text, className = '' }: ScrollingLabelProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const checkOverflow = () => {
      setOverflows(measure.scrollWidth > container.clientWidth);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);

    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={containerRef} className={`relative block w-full overflow-hidden ${className}`}>
      <span
        ref={measureRef}
        aria-hidden="true"
        className="invisible absolute whitespace-nowrap pointer-events-none"
      >
        {text}
      </span>
      {overflows ? (
        <span className="inline-flex w-max scrolling-label-track">
          <span className="whitespace-nowrap pe-4">{text}</span>
          <span className="whitespace-nowrap pe-4">{text}</span>
        </span>
      ) : (
        <span className="block whitespace-nowrap text-center">{text}</span>
      )}
    </span>
  );
}
