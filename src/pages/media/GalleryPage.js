import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./GalleryPage.css";
import Navbar from "../../components/menu/Navbar";
import Footer from "../../components/menu/Footer";
import GalleryError from "../../components/media/GalleryError";
import {
  getDocumentationImagesById,
  getDocumentationItemById,
} from "../../services/documentationApi";

const IMAGE_PAGE_SIZE = 12;

const mergeUniqueImages = (existingImages, incomingImages) => {
  const seen = new Set(existingImages);
  const merged = [...existingImages];

  incomingImages.forEach((imageUrl) => {
    if (!seen.has(imageUrl)) {
      seen.add(imageUrl);
      merged.push(imageUrl);
    }
  });

  return merged;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const GallerySkeleton = ({ count = 8 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="gallery-item gallery-skeleton-item"
        aria-hidden="true"
      >
        <div className="gallery-skeleton-block" />
      </div>
    ))}
  </>
);

const GalleryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackItem =
    location.state?.item && location.state.item.id === id
      ? location.state.item
      : null;
  const [item, setItem] = useState(fallbackItem);
  const [selectedImage, setSelectedImage] = useState(null);
  const [driveImages, setDriveImages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prefetchedPage, setPrefetchedPage] = useState(null);
  const [hasMoreImages, setHasMoreImages] = useState(false);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isLoadingDriveImages, setIsLoadingDriveImages] = useState(false);
  const [driveImageError, setDriveImageError] = useState("");
  const [isLoadingMoreImages, setIsLoadingMoreImages] = useState(false);
  const loadMoreRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    const loadItem = async () => {
      setIsLoadingItem(true);

      if (fallbackItem) {
        setItem(fallbackItem);
      }

      try {
        const nextItem = await getDocumentationItemById(id);
        if (!isCancelled) {
          setItem(nextItem || null);
        }
      } catch (error) {
        if (!isCancelled && !fallbackItem) {
          setItem(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingItem(false);
        }
      }
    };

    loadItem();

    return () => {
      isCancelled = true;
    };
  }, [id, fallbackItem]);

  const galleryImages = useMemo(() => {
    if (driveImages.length > 0) {
      return driveImages;
    }
    return item?.images || [];
  }, [driveImages, item?.images]);

  useEffect(() => {
    let isCancelled = false;

    const loadDriveImages = async () => {
      if (!item) {
        setDriveImages([]);
        setNextPageToken("");
        setPrefetchedPage(null);
        setHasMoreImages(false);
        setDriveImageError("");
        return;
      }

      if (!item.driveFolderId) {
        setDriveImages([]);
        setNextPageToken("");
        setPrefetchedPage(null);
        setHasMoreImages(false);
        setDriveImageError("");
        return;
      }

      setIsLoadingDriveImages(true);
      setDriveImageError("");
      setDriveImages([]);
      setNextPageToken("");
      setPrefetchedPage(null);
      setHasMoreImages(false);

      try {
        const firstPage = await getDocumentationImagesById(item.id, {
          pageSize: IMAGE_PAGE_SIZE,
        });

        if (isCancelled) {
          return;
        }

        setDriveImages(firstPage.images);
        setNextPageToken(firstPage.nextPageToken || "");
        setPrefetchedPage(firstPage.prefetchedNextPage || null);
        setHasMoreImages(
          Boolean(firstPage.nextPageToken) ||
            Boolean(firstPage.prefetchedNextPage?.images?.length),
        );
      } catch (error) {
        if (!isCancelled) {
          setDriveImages([]);
          setNextPageToken("");
          setPrefetchedPage(null);
          setHasMoreImages(false);
          setDriveImageError(
            "Gagal memuat foto dari backend Google Drive API.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingDriveImages(false);
        }
      }
    };

    loadDriveImages();

    return () => {
      isCancelled = true;
    };
  }, [item]);

  const loadMoreImages = useCallback(async () => {
    if (!item?.id || !item?.driveFolderId || !hasMoreImages) {
      return;
    }

    if (isLoadingDriveImages || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMoreImages(true);

    try {
      if (prefetchedPage && prefetchedPage.images.length > 0) {
        setDriveImages((previousImages) =>
          mergeUniqueImages(previousImages, prefetchedPage.images),
        );

        const tokenAfterPrefetchedPage = prefetchedPage.nextPageToken || "";
        setNextPageToken(tokenAfterPrefetchedPage);
        setPrefetchedPage(null);

        if (!tokenAfterPrefetchedPage) {
          setHasMoreImages(false);
          return;
        }

        const preloadedPage = await getDocumentationImagesById(item.id, {
          pageSize: IMAGE_PAGE_SIZE,
          pageToken: tokenAfterPrefetchedPage,
        });

        setPrefetchedPage({
          images: preloadedPage.images,
          nextPageToken: preloadedPage.nextPageToken,
        });
        setHasMoreImages(
          preloadedPage.images.length > 0 ||
            Boolean(preloadedPage.nextPageToken),
        );
        return;
      }

      if (!nextPageToken) {
        setHasMoreImages(false);
        return;
      }

      const page = await getDocumentationImagesById(item.id, {
        pageSize: IMAGE_PAGE_SIZE,
        pageToken: nextPageToken,
      });

      setDriveImages((previousImages) =>
        mergeUniqueImages(previousImages, page.images),
      );
      setNextPageToken(page.nextPageToken || "");
      setPrefetchedPage(page.prefetchedNextPage || null);
      setHasMoreImages(
        Boolean(page.nextPageToken) ||
          Boolean(page.prefetchedNextPage?.images?.length),
      );
    } catch (error) {
      setDriveImageError("Gagal memuat halaman foto berikutnya.");
      setHasMoreImages(false);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMoreImages(false);
    }
  }, [
    hasMoreImages,
    isLoadingDriveImages,
    item?.driveFolderId,
    item?.id,
    nextPageToken,
    prefetchedPage,
  ]);

  useEffect(() => {
    if (!hasMoreImages || isLoadingItem || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          loadMoreImages();
        }
      },
      {
        root: null,
        rootMargin: "240px",
        threshold: 0.01,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreImages, isLoadingItem, loadMoreImages]);

  if (!item && !isLoadingItem) {
    return (
      <>
        <main className="gallery-page">
          <GalleryError onBack={() => navigate("/media/documentation")} />
        </main>
      </>
    );
  }

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const displayTitle = item?.title || "";
  const displayDate = item?.date ? formatDate(item.date) : "";
  const displayDescription = item?.description || "";

  return (
    <>
      <Navbar />
      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-content">
            <button
              className="back-button"
              onClick={() => navigate("/media/documentation")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Kembali
            </button>
            <p className="gallery-kicker">GKJ Kebonarum Klaten</p>
            <h1 className="gallery-title">
              Dokumentasi
              <br />
              {displayTitle}
            </h1>
            {displayDate && (
              <p className="gallery-meta">
                <span className="gallery-date">{displayDate}</span>
              </p>
            )}
            {displayDescription && (
              <p className="gallery-description">{displayDescription}</p>
            )}
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-section-inner">
            <div className="gallery-grid">
              {isLoadingDriveImages && galleryImages.length === 0 ? (
                <GallerySkeleton count={10} />
              ) : galleryImages.length > 0 ? (
                <>
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="gallery-item"
                      onClick={() => handleImageClick(image)}
                    >
                      <img src={image} alt="" loading="lazy" decoding="async" />
                      <div className="gallery-item-overlay"></div>
                    </div>
                  ))}
                  {isLoadingMoreImages && <GallerySkeleton count={4} />}
                </>
              ) : driveImageError ? (
                <p className="gallery-no-images">{driveImageError}</p>
              ) : (
                <GallerySkeleton count={6} />
              )}
            </div>
            {hasMoreImages && (
              <div
                ref={loadMoreRef}
                className="gallery-load-trigger"
                aria-hidden="true"
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="gallery-modal-content">
            <button className="gallery-modal-close" onClick={closeModal}>
              ✕
            </button>
            <img src={selectedImage} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
