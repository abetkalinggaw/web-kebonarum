import React, { useState, useEffect, useRef } from "react";
import "./Preloader.css";

const greetings = ["Shalom", "Berkah Dalem", "Selamat Datang di GKJ Kebonarum"];

const Preloader = ({
  transitionState,
  targetName,
  onInitialDone,
  onExitDone,
}) => {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Target progress calculated from actual asset loading
  const targetProgressRef = useRef(0);

  // 1. Asset Tracker & Real Load Calculation
  useEffect(() => {
    if (transitionState !== "initial") return;

    // Reset progress
    setProgress(0);
    targetProgressRef.current = 0;

    const images = Array.from(document.images);
    // +1 reserved for window load & font loading readiness
    const totalAssets = images.length + 1;
    let loadedAssets = 0;

    const incrementAsset = () => {
      loadedAssets++;
      const calculated = Math.min(
        Math.floor((loadedAssets / totalAssets) * 100),
        99,
      );
      if (calculated > targetProgressRef.current) {
        targetProgressRef.current = calculated;
      }
    };

    // Track Image Loading
    images.forEach((img) => {
      if (img.complete) {
        incrementAsset();
      } else {
        img.addEventListener("load", incrementAsset, { once: true });
        img.addEventListener("error", incrementAsset, { once: true }); // Avoid sticking on error
      }
    });

    // Track Window & Fonts Loading
    const handleFullLoad = () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          targetProgressRef.current = 100;
        });
      } else {
        targetProgressRef.current = 100;
      }
    };

    if (document.readyState === "complete") {
      handleFullLoad();
    } else {
      window.addEventListener("load", handleFullLoad, { once: true });
    }

    // 2. Smooth Interpolation Loop for Percentage Counter
    let animationFrameId;
    const animateProgress = () => {
      setProgress((prev) => {
        if (prev < targetProgressRef.current) {
          return prev + 1;
        }
        return prev;
      });
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("load", handleFullLoad);
    };
  }, [transitionState]);

  // 3. Update Greeting Index based on Current Progress
  useEffect(() => {
    if (progress < 33) {
      setGreetingIndex(0);
    } else if (progress < 66) {
      setGreetingIndex(1);
    } else {
      setGreetingIndex(2);
    }
  }, [progress]);

  // 4. Trigger completion when 100% is reached
  useEffect(() => {
    if (transitionState === "initial" && progress >= 100) {
      const timer = setTimeout(() => {
        if (onInitialDone) onInitialDone();
      }, 400); // Brief pause at 100% before transition out
      return () => clearTimeout(timer);
    }
  }, [progress, transitionState, onInitialDone]);

  // 5. Lock scrolling during transitions
  useEffect(() => {
    if (
      transitionState === "initial" ||
      transitionState === "entering" ||
      transitionState === "initial-exiting" ||
      transitionState === "exiting"
    ) {
      document.body.style.overflow = "hidden";
    }

    if (transitionState === "idle") {
      document.body.style.overflow = "";
      document.body.classList.add("app-ready");
    }
  }, [transitionState]);

  // 6. Handle Exiting Animations
  useEffect(() => {
    if (
      transitionState === "initial-exiting" ||
      transitionState === "exiting"
    ) {
      const t = setTimeout(() => {
        if (onExitDone) onExitDone();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [transitionState, onExitDone]);

  // Determine CSS classes and layout
  let containerClass = "preloader-container ";
  let showPercentage = false;
  let titleContent = null;

  if (transitionState === "initial") {
    containerClass += "initial-load";
    showPercentage = true;
    titleContent = (
      <div className="preloader-title-wrapper">
        {greetings.map((text, index) => (
          <h1
            key={index}
            className={`preloader-title ${
              index === greetingIndex
                ? "active"
                : index < greetingIndex
                  ? "exit"
                  : ""
            }`}
          >
            {text}
          </h1>
        ))}
      </div>
    );
  } else if (transitionState === "initial-exiting") {
    containerClass += "fade-out";
    showPercentage = true;
    titleContent = (
      <div className="preloader-title-wrapper">
        <h1 className="preloader-title active">{greetings[2]}</h1>
      </div>
    );
  } else if (transitionState === "entering") {
    containerClass += "nav-entering";
    titleContent = <h1 className="preloader-title active">{targetName}</h1>;
  } else if (transitionState === "exiting") {
    containerClass += "fade-out";
    titleContent = <h1 className="preloader-title active">{targetName}</h1>;
  } else {
    // idle
    containerClass += "idle-hidden";
  }

  return (
    <div className={containerClass}>
      <div className="preloader-content">{titleContent}</div>
      {showPercentage && (
        <div className="preloader-percentage-huge">{progress}%</div>
      )}
    </div>
  );
};

export default Preloader;
