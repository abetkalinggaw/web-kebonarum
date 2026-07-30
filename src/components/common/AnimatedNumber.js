import React, { useState, useEffect } from 'react';

const AnimatedNumber = ({ targetValue, duration = 2000, startAnimating }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startAnimating) return;

    const parsedTarget = parseInt(targetValue.toString().replace(/\./g, ""), 10);
    if (isNaN(parsedTarget)) {
      setValue(targetValue);
      return;
    }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing: easeOutExpo
      const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const current = Math.floor(easeProgress * parsedTarget);
      
      setValue(current);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setValue(parsedTarget);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration, startAnimating]);

  if (typeof targetValue === 'string' && isNaN(parseInt(targetValue.replace(/\./g, ""), 10))) {
    return <>{targetValue}</>;
  }

  return <>{value.toLocaleString('id-ID')}</>;
};

export default AnimatedNumber;
