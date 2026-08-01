import { useEffect, useRef, useState } from "react";
import "./AboutPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import VisiMisi from "../../components/landing_page/VisiMisi";
import SejarahBriefGKJ from "../../components/about_page/SejarahBriefGKJ";
import StrukturOrganisasiGKJ from "../../components/about_page/StrukturOrganisasiGKJ";
import PendetaGKJ from "../../components/about_page/PendetaGKJ";
import MajelisGKJ from "../../components/about_page/MajelisGKJ";
import Separator from "../../components/landing_page/Separator";
import backgroundVideo from "../../assets/videos/background-video.mp4";

const ABOUT_PROFILE_VIDEO_ID = "sYPtPdGbB78";

const CustomYouTubePlayer = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame Player API dynamically
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          disablekb: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setIsPlaying(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setProgress(100);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const curr = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration() || duration;
        setCurrentTime(curr);
        setDuration(dur);
        if (dur > 0) {
          setProgress((curr / dur) * 100);
        }
      }
    }, 250);

    return () => {
      clearInterval(interval);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!playerRef.current || duration === 0) return;
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    playerRef.current.seekTo(newTime, true);
    setProgress(newProgress);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div ref={containerRef} className="custom-yt-container">
      <div id={`yt-player-${videoId}`} className="custom-yt-iframe" />

      {/* Center Play/Pause Touch/Click Overlay */}
      <button 
        type="button" 
        className={`custom-yt-center-btn ${!isPlaying ? "visible" : ""}`}
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Bottom Bar: Progress Bar + Time + Fullscreen */}
      <div className="custom-yt-controls-bar">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="custom-yt-seekbar"
          aria-label="Video progress"
        />
        <div className="custom-yt-bar-footer">
          <span className="custom-yt-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            type="button"
            className="custom-yt-fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isVideoOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsVideoOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <>
      <Navbar />
      <main className="about-page">
        <section className="about-hero">
          <video className="about-hero-video" autoPlay muted loop playsInline>
            <source src={backgroundVideo} type="video/mp4" />
            Browser Anda tidak mendukung tag video.
          </video>

          <div className="about-hero-overlay"></div>

          <div className="about-hero-content">
            <span className="section-tag light">PROFIL GEREJA</span>
            <h1 className="about-title">Tentang GKJ Kebonarum</h1>
            <p className="about-lead">
              GKJ Kebonarum adalah gereja yang melayani jemaat dan masyarakat
              dengan kasih, pengajaran firman, dan pelayanan yang berdampak.
            </p>
            <div className="custom-button-container">
              <button
                className="minimal-glass-btn"
                onClick={() => setIsVideoOpen(true)}
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Video Profil GKJ Kebonarum
              </button>
            </div>
          </div>
        </section>
        <Separator />
        <VisiMisi />
        <StrukturOrganisasiGKJ />
        <PendetaGKJ />
        <MajelisGKJ />
        <SejarahBriefGKJ />
      </main>
      {isVideoOpen && (
        <div
          className="about-video-modal-backdrop"
          onClick={() => setIsVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video profil GKJ Kebonarum"
        >
          <div
            className="about-video-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="about-video-modal-close"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Tutup video"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="about-video-modal-frame">
              <CustomYouTubePlayer videoId={ABOUT_PROFILE_VIDEO_ID} />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AboutPage;
