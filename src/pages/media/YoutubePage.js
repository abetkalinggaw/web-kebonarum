import { useEffect, useState } from "react";
import "./YoutubePage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import { LIVESTREAM_TITLE_KEYWORDS } from "../../config/mediaKeywords";

const youtubeChannelFeedUrl =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCMUr6P7SpHUbsZYAUo84byA";

const fallbackYoutubeVideos = [
  {
    id: "VomB-0dY230",
    title: "THE FIRST NOEL | COVER BY EKLESIA",
    uploadedAt: "2025-12-25",
  },
  {
    id: "LSaeu_usXsM",
    title: "LAGU PENGHIBURAN ROHANI KRISTEN AKUSTIK (Cover)",
    uploadedAt: "2025-07-29",
  },
  {
    id: "4kgsPTC164c",
    title: "LAGU PENGHIBURAN KERONCONG ROHANI (Cover)",
    uploadedAt: "2025-07-29",
  },
  {
    id: "RNOCQ13-alU",
    title: "LAGU PENGHIBURAN KARAWITAN ROHANI (Cover)",
    uploadedAt: "2025-07-29",
  },
  {
    id: "periBEz-k4U",
    title: "DOA BAPA KAMI (Cover)",
    uploadedAt: "2025-04-18",
  },
  {
    id: "uYMSg37IDlw",
    title: "SHINE JESUS SHINE | COVER BY EKLESIA",
    uploadedAt: "2024-12-25",
  },
  {
    id: "tiJvvmNADws",
    title: "KJ 329 - TINGGAL SERTAKU (Cover)",
    uploadedAt: "2024-03-29",
  },
  {
    id: "uv2Lx43X2K4",
    title: "KPJ 218 DALU SUCI (Cover)",
    uploadedAt: "2023-12-25",
  },
  {
    id: "75fe0Pn_MbU",
    title: "PELANGI DIMATAMU JINGLE KOMPAREM GKJ KEBONARUM",
    uploadedAt: "2023-12-25",
  },
  {
    id: "Of99cgUkpLQ",
    title: "IBADAH EKSPRESIF | 22 FEBRUARI 2026 | GKJ KEBONARUM",
    uploadedAt: "2026-02-23",
  },
  {
    id: "z59ltPd3wtc",
    title: "IBADAH RABU ABU | 18 FEBRUARI 2026 | GKJ KEBONARUM",
    uploadedAt: "2026-02-19",
  },
  {
    id: "wRta4MvgPXc",
    title: "PERAYAAN NATAL BLOK V GKJ KEBONARUM || 26 DESEMBER 2025",
    uploadedAt: "2025-12-27",
  },
  {
    id: "HoC6t5ENF2Y",
    title:
      'IBADAH NATAL GKJ KEBONARUM 25 DESEMBER 2025 || "LAWATAN ALLAH MENGATASI KETAKUTAN"',
    uploadedAt: "2025-12-25",
  },
  {
    id: "t28YQVcGcsM",
    title:
      "IBADAH PELETAKAN DAN PENEGUHAN MAJELIS | GKJ KEBONARUM | 30 NOVEMBER 2025",
    uploadedAt: "2025-11-30",
  },
  {
    id: "Orr3MN9daA0",
    title: "IBADAH EXPRESIF BULAN KELUARGA  || GKJ KEBONARUM || 26-10-2025",
    uploadedAt: "2025-10-26",
  },
  {
    id: "jifWiYjp5zE",
    title:
      "IBADAH HARI PERJAMUAN KUDUS se-DUNIA || GKJ KEBONARUM || 05-10-2025",
    uploadedAt: "2025-10-05",
  },
  {
    id: "wYTvVNsARp4",
    title:
      "IBADAH EKSPRESIF EKOLOGI DAN HARI DOA ALKITAB || MINGGU 28 SEPTEMBER 2025 || GKJ KEBONARUM",
    uploadedAt: "2025-09-28",
  },
  {
    id: "6ePIEiFAsd0",
    title:
      "IBADAH PENEGUHAN PERNIKAHAN & PEMBERKATAN PERKAWINAN FERRA & CAHYO || 28-09-2025 || GKJ KEBONARUM",
    uploadedAt: "2025-09-28",
  },
  {
    id: "JE0KzMQTCJc",
    title:
      "IBADAH EKSPRESIF HARI KEMERDEKAAN || MINGGU 31 AGUSTUS 2025 || GKJ KEBONARUM",
    uploadedAt: "2025-09-01",
  },
  {
    id: "2l95a8cgoqA",
    title:
      "IBADAH EKSPRESIF HARI ANAK NASIONAL || MINGGU 27 JULI 2025 || GKJ KEBONARUM",
    uploadedAt: "2025-07-28",
  },
];

const isLivestreamVideo = (title = "") => {
  const normalizedTitle = title.toUpperCase();
  return LIVESTREAM_TITLE_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword),
  );
};

const parseFeedVideos = (xmlText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const entries = Array.from(xml.getElementsByTagName("entry"));

  return entries
    .map((entry) => {
      const id = entry
        .getElementsByTagName("yt:videoId")[0]
        ?.textContent?.trim();
      const title = entry.getElementsByTagName("title")[0]?.textContent?.trim();
      const uploadedAt = entry
        .getElementsByTagName("published")[0]
        ?.textContent?.trim();

      if (!id || !title || !uploadedAt) {
        return null;
      }

      return { id, title, uploadedAt };
    })
    .filter(Boolean);
};

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const VideoCard = ({ item }) => (
  <article className="youtube-video-card">
    <div className="youtube-video-frame-wrapper">
      <iframe
        className="youtube-video-frame"
        src={`https://www.youtube.com/embed/${item.id}`}
        title={item.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
    <div className="youtube-video-meta">
      <h3 className="youtube-video-title">{item.title}</h3>
      <p className="youtube-video-date">{formatDate(item.uploadedAt)}</p>
    </div>
  </article>
);

const YoutubePage = () => {
  const [youtubeVideos, setYoutubeVideos] = useState(fallbackYoutubeVideos);

  useEffect(() => {
    const getYoutubeVideos = async () => {
      try {
        const response = await fetch(youtubeChannelFeedUrl);
        const xmlText = await response.text();
        const videos = parseFeedVideos(xmlText);

        if (videos.length > 0) {
          setYoutubeVideos(videos);
        }
      } catch (error) {
        setYoutubeVideos(fallbackYoutubeVideos);
      }
    };

    getYoutubeVideos();
  }, []);

  const livestreamVideos = youtubeVideos.filter((video) =>
    isLivestreamVideo(video.title),
  );
  const regularVideos = youtubeVideos.filter(
    (video) => !isLivestreamVideo(video.title),
  );

  const upcomingLivestream = livestreamVideos[0] || youtubeVideos[0];
  const pastLivestreams = livestreamVideos.slice(1, 4);
  const latestVideos = regularVideos.slice(0, 9);

  return (
    <>
      <Navbar />
      <main className="youtube-page">
        <section className="youtube-hero">
          <div className="youtube-hero-content">
            <p className="youtube-kicker">GKJ Kebonarum Klaten</p>
            <h1 className="youtube-title">
              YouTube
              <br />
              GKJ Kebonarum
            </h1>
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
              YouTube
            </a>
          </div>
        </section>

        <section className="youtube-section">
          <div className="youtube-section-inner">
            <h2 className="youtube-section-title">Upcoming Livestreaming</h2>
            <div className="youtube-grid youtube-grid-single">
              {upcomingLivestream ? (
                <VideoCard item={upcomingLivestream} />
              ) : (
                <p className="youtube-video-date">
                  Belum ada konten livestream.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="youtube-section youtube-section-alt">
          <div className="youtube-section-inner">
            <h2 className="youtube-section-title">Past Livestreaming</h2>
            <div className="youtube-grid youtube-grid-three">
              {pastLivestreams.map((item) => (
                <VideoCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="youtube-section">
          <div className="youtube-section-inner">
            <h2 className="youtube-section-title">Latest Videos</h2>
            <div className="youtube-grid youtube-grid-six">
              {latestVideos.map((item) => (
                <VideoCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default YoutubePage;
