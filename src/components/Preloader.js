import React, { useState, useEffect } from 'react';
import './Preloader.css';

const greetings = ["Berkah Dalem", "Shalom", "Damai Sejahtera"];

const Preloader = ({ transitionState, targetName, onInitialDone, onExitDone }) => {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Initial load logic
  useEffect(() => {
    if (transitionState !== 'initial') return;
    
    document.body.style.overflow = 'hidden';
    const duration = 2400; 
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress < 33) {
        setGreetingIndex(0);
      } else if (currentProgress < 66) {
        setGreetingIndex(1);
      } else {
        setGreetingIndex(2);
      }

      if (currentStep >= steps) {
        clearInterval(timer);
        if (onInitialDone) {
          setTimeout(onInitialDone, 300);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [transitionState, onInitialDone]);

  // Lock scrolling during transitions
  useEffect(() => {
    if (transitionState === 'initial' || transitionState === 'entering' || transitionState === 'initial-exiting' || transitionState === 'exiting') {
      document.body.style.overflow = 'hidden';
    } 
    
    if (transitionState === 'idle') {
      document.body.style.overflow = '';
      document.body.classList.add('app-ready');
    }
  }, [transitionState]);

  // Handle exiting animations
  useEffect(() => {
    if (transitionState === 'initial-exiting' || transitionState === 'exiting') {
      const t = setTimeout(() => {
        if (onExitDone) onExitDone();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [transitionState, onExitDone]);

  // Determine classes based on transition state
  let containerClass = 'preloader-container ';
  let showPercentage = false;
  let titleContent = null;

  if (transitionState === 'initial') {
    containerClass += 'initial-load';
    showPercentage = true;
    titleContent = (
      <div className="preloader-title-wrapper">
        {greetings.map((text, index) => (
          <h1 
            key={index} 
            className={`preloader-title ${
              index === greetingIndex ? 'active' : index < greetingIndex ? 'exit' : ''
            }`}
          >
            {text}
          </h1>
        ))}
      </div>
    );
  } else if (transitionState === 'initial-exiting') {
    containerClass += 'fade-out';
    showPercentage = true;
    titleContent = (
      <div className="preloader-title-wrapper">
        <h1 className="preloader-title active">{greetings[2]}</h1>
      </div>
    );
  } else if (transitionState === 'entering') {
    containerClass += 'nav-entering';
    titleContent = <h1 className="preloader-title active">{targetName}</h1>;
  } else if (transitionState === 'exiting') {
    containerClass += 'fade-out';
    titleContent = <h1 className="preloader-title active">{targetName}</h1>;
  } else {
    // idle
    containerClass += 'idle-hidden';
  }

  return (
    <div className={containerClass}>
      <div className="preloader-content">
        {titleContent}
      </div>
      {showPercentage && (
        <div className="preloader-percentage-huge">
          {progress}%
        </div>
      )}
    </div>
  );
};

export default Preloader;
