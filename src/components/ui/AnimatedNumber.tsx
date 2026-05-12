import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
}

export function AnimatedNumber({ value, formatter = (number) => String(Math.round(number)) }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration: 0.75,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayValue(latest),
      onComplete: () => {
        previousValue.current = value;
      },
    });
    return () => controls.stop();
  }, [value]);

  return <>{formatter(displayValue)}</>;
}
