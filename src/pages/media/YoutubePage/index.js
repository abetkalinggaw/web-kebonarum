import { useEffect, useState } from "react";
import "./YoutubePage.css";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import { getYoutubeVideos } from "../../../services/youtubeApi";

const YOUTUBE_CACHE_KEY = "youtube-page-content-cache";
const YOUTUBE_CACHE_TTL_MS = 60 * 60 * 1000;

const readYoutubeCache = () => {
  try {
    const rawCache = localStorage.getItem(YOUTUBE_CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache);
    const isExpired = Date.now() - parsedCache.timestamp > YOUTUBE_CACHE_TTL_MS;

    if (isExpired) {
      localStorage.removeItem(YOUTUBE_CACHE_KEY);
      return null;
    }

    const items = Array.isArray(parsedCache.items) ? parsedCache.items : [];
    const livestreamItems = Array.isArray(parsedCache.livestreamItems)
      ? parsedCache.livestreamItems
      : [];
    const liveNowItems = Array.isArray(parsedCache.liveNowItems)
      ? parsedCache.liveNowItems
      : [];

    return {
      items,
      livestreamItems,
      liveNowItems,
    };
  } catch (error) {
    localStorage.removeItem(YOUTUBE_CACHE_KEY);
    return null;
  }
};

const writeYoutubeCache = ({ items, livestreamItems, liveNowItems }) => {
  try {
    const payload = {
      timestamp: Date.now(),
      items,
      livestreamItems,
      liveNowItems,
    };

    localStorage.setItem(YOUTUBE_CACHE_KEY, JSON.stringify(payload));
  } catch (error) {}
};

const PlayIcon = () => (
  <svg viewBox="0 0 68 48" width="68" height="48">
    <path
      d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.8 0 34 0 34 0S12.2 0 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C0 12.5 0 24 0 24s0 11.5 1.5 16.3c.8 2.9 3 5.2 5.9 6C12.2 48 34 48 34 48s21.8 0 26.6-1.7c2.9-.8 5.1-3.1 5.9-6C68 35.5 68 24 68 24s0-11.5-1.5-16.3z"
      fill="#ff0000"
    />
    <path d="M45 24 27 14v20" fill="#fff" />
  </svg>
);

const VideoModal = ({ item, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="youtube-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="youtube-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="youtube-modal-header">
          <h2 className="youtube-modal-title">{item.title}</h2>
          <button
            className="youtube-modal-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="youtube-modal-video-wrapper">
          <iframe
            className="youtube-modal-iframe"
            src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0`}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

const VideoCard = ({ item, onOpen }) => (
  <article className="youtube-video-card">
    <button
      className="youtube-video-frame-wrapper"
      onClick={() => onOpen(item)}
      aria-label={`Tonton: ${item.title}`}
    >
      <img
        className="youtube-video-thumbnail"
        src={`https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg`}
        alt={item.title}
        loading="lazy"
        onError={(e) => {
          if (!e.target.src.includes("mqdefault")) {
            e.target.src = `https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`;
          }
        }}
      />
      <span className="youtube-play-button" aria-hidden="true">
        <PlayIcon />
      </span>
    </button>
    <div className="youtube-video-meta">
      <h3 className="youtube-video-title">{item.title}</h3>
    </div>
  </article>
);

const SkeletonCard = () => (
  <article
    className="youtube-video-card youtube-video-card-skeleton"
    aria-hidden
  >
    <div className="youtube-video-frame-wrapper youtube-skeleton-block"></div>
    <div className="youtube-video-meta">
      <div className="youtube-skeleton-line youtube-skeleton-title"></div>
    </div>
  </article>
);


const YoutubePage = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [livestreamVideos, setLivestreamVideos] = useState([]);
  const [liveNowVideos, setLiveNowVideos] = useState([]);
  const [isLoadingYoutubeVideos, setIsLoadingYoutubeVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);

  useEffect(() => {
    const cachedContent = readYoutubeCache();

    if (cachedContent) {
      setYoutubeVideos(cachedContent.items);
      setLivestreamVideos(cachedContent.livestreamItems);
      setLiveNowVideos(cachedContent.liveNowItems);
      setIsLoadingYoutubeVideos(false);
    }

    const loadYoutubeVideos = async () => {
      setIsLoadingYoutubeVideos(!cachedContent);

      try {
        const { items, livestreamItems, liveNowItems } = await getYoutubeVideos(
          {
            pageSize: 120,
            livestreamPageSize: 12,
          },
        );
        setYoutubeVideos(items);
        setLivestreamVideos(livestreamItems);
        setLiveNowVideos(liveNowItems);
        writeYoutubeCache({ items, livestreamItems, liveNowItems });
      } catch (error) {
        if (!cachedContent) {
          setYoutubeVideos([]);
          setLivestreamVideos([]);
          setLiveNowVideos([]);
        }
      } finally {
        setIsLoadingYoutubeVideos(false);
      }
    };

    loadYoutubeVideos();
  }, []);

  const upcomingLivestream = liveNowVideos[0];
  const pastLivestreams = livestreamVideos.slice(0, 3);
  // Only exclude past-livestream IDs from Our Content — keeping liveNowVideos
  // separate avoids wiping out all videos when RSS fallback puts the same
  // items in multiple sections.
  const pastLivestreamIds = new Set(
    livestreamVideos.map((video) => video?.id).filter(Boolean),
  );
  const ourContent = youtubeVideos
    .filter((video) => !pastLivestreamIds.has(video?.id))
    .slice(0, 4);

  const liveNowThumbnail = upcomingLivestream
    ? `https://i.ytimg.com/vi/${upcomingLivestream.id}/maxresdefault.jpg`
    : null;

  return (
    <>
      <Navbar />
      <main className="youtube-page">
        <section
          className={`youtube-hero ${upcomingLivestream ? "youtube-hero-has-live" : ""}`}
          style={
            liveNowThumbnail
              ? {
                  backgroundImage: `url(${liveNowThumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="youtube-hero-content" style={isHeroPlaying ? { width: '100%', maxWidth: '1000px' } : {}}>
            {upcomingLivestream ? (
              isHeroPlaying ? (
                <div className="hero-video-container">
                  <div className="youtube-modal-video-wrapper">
                    <iframe
                      className="youtube-modal-iframe"
                      src={`https://www.youtube.com/embed/${upcomingLivestream.id}?autoplay=1&rel=0`}
                      title={upcomingLivestream.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="hero-live-badge-wrapper">
                    <span className="live-now-badge">
                      <span className="live-now-pulse"></span>
                      SEDANG SIARAN LANGSUNG
                    </span>
                  </div>
                  <h1 className="youtube-title">{upcomingLivestream.title}</h1>
                  <p className="youtube-lead">
                    Saksikan siaran langsung ibadah / kegiatan GKJ Kebonarum yang
                    sedang berlangsung saat ini.
                  </p>
                  <button
                    className="hero-watch-live-btn"
                    onClick={() => setIsHeroPlaying(true)}
                  >
                    <PlayIcon />
                    Tonton Siaran Langsung
                  </button>
                </>
              )
            ) : (
              <>
                <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
                <h1 className="youtube-title">YouTube GKJ Kebonarum</h1>
                <p className="youtube-lead">
                  Saksikan berbagai video ibadah, acara, dan kegiatan GKJ Kebonarum
                  di saluran YouTube resmi kami. Jangan lupa untuk subscribe agar
                  tidak ketinggalan update terbaru dari pelayanan dan kegiatan kami.
                </p>
                <a
                  className="youtube-account-link"
                  href={"https://www.youtube.com/@gkjkebonarummultimedia3831"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Saluran YouTube
                </a>
              </>
            )}
          </div>
        </section>


        <section className="youtube-section youtube-section-alt">
          <div className="youtube-section-inner">
            <h2 className="youtube-section-title">Siaran Langsung Sebelumnya</h2>
            <div className="youtube-grid youtube-grid-three">
              {isLoadingYoutubeVideos ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={`past-livestream-skeleton-${index}`} />
                ))
              ) : pastLivestreams.length > 0 ? (
                pastLivestreams.map((item) => (
                  <VideoCard
                    key={item.id}
                    item={item}
                    onOpen={setSelectedVideo}
                  />
                ))
              ) : (
                <p className="youtube-error-text">Belum ada data livestream.</p>
              )}
            </div>
          </div>
        </section>

        <section className="youtube-section">
          <div className="youtube-section-inner">
            <h2 className="youtube-section-title">Konten Kami</h2>
            <div className="youtube-grid youtube-grid-six">
              {isLoadingYoutubeVideos ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={`our-content-skeleton-${index}`} />
                ))
              ) : ourContent.length > 0 ? (
                ourContent.map((item) => (
                  <VideoCard
                    key={item.id}
                    item={item}
                    onOpen={setSelectedVideo}
                  />
                ))
              ) : (
                <p className="youtube-error-text">Belum ada video terbaru.</p>
              )}
            </div>
            <div className="view-all-button-container">
              <button
                className="view-all-button"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/@gkjkebonarummultimedia3831/videos",
                    "_blank",
                  )
                }
              >
                Lihat Semua Konten
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {selectedVideo && (
        <VideoModal
          item={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default YoutubePage;
