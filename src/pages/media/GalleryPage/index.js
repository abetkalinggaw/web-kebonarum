import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./GalleryPage.css";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import GalleryError from "../../../components/media/GalleryError";
import {
  getDocumentationImagesById,
  getDocumentationItemById,
} from "../../../services/documentationApi";

const IMAGE_PAGE_SIZE = 24;
const GALLERY_IMAGE_LOAD_DELAY_MS = 60;
const GALLERY_IMAGE_REQUEST_DELAY_MS = 100;
const LOAD_MORE_REQUEST_DELAY_MS = 140;

const extractDriveFileId = (url = "") => {
  if (!url) {
    return "";
  }

  const directPathMatch = url.match(/\/d\/([^=/?&#]+)/);
  if (directPathMatch?.[1]) {
    return directPathMatch[1];
  }

  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (queryMatch?.[1]) {
    return queryMatch[1];
  }

  return "";
};

const buildImageCandidates = (src = "", imageObj = null) => {
  const candidates = [];
  const rawSrc = typeof src === "string" ? src : src?.url || imageObj?.url || "";

  let thumbnailLink = "";
  let webContentLink = "";
  let id = "";

  if (typeof src === "object" && src !== null) {
    thumbnailLink = src.thumbnailLink || "";
    webContentLink = src.webContentLink || "";
    id = src.id || "";
  }
  if (imageObj && typeof imageObj === "object") {
    thumbnailLink = thumbnailLink || imageObj.thumbnailLink || "";
    webContentLink = webContentLink || imageObj.webContentLink || "";
    id = id || imageObj.id || "";
  }

  if (!id && rawSrc) {
    id = extractDriveFileId(rawSrc);
  }

  if (thumbnailLink) {
    const highRes = thumbnailLink
      .replace(/=s\d+/, "=s1600")
      .replace(/=w\d+/, "=w1600");
    candidates.push(highRes);
    candidates.push(thumbnailLink);
  }

  if (rawSrc) {
    candidates.push(rawSrc);
  }

  if (id) {
    candidates.push(`https://lh3.googleusercontent.com/d/${id}=w1600`);
    candidates.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`);
    candidates.push(`https://drive.google.com/uc?export=view&id=${id}`);
  }

  if (webContentLink) {
    candidates.push(webContentLink);
  }

  return [...new Set(candidates.filter(Boolean))];
};

const mergeUniqueImages = (existingImages, incomingImages) => {
  const getIdentifier = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.id || img.url || "";
  };

  const seen = new Set(existingImages.map(getIdentifier));
  const merged = [...existingImages];

  incomingImages.forEach((image) => {
    const key = getIdentifier(image);
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(image);
    }
  });

  return merged;
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

const LazyGalleryImage = ({ src, imageObj, isVideo, alt, onClick, delay = 0 }) => {
  const imageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageCandidates = useMemo(
    () => buildImageCandidates(src, imageObj),
    [src, imageObj],
  );
  const activeImageSrc = imageCandidates[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [src, imageObj]);

  useEffect(() => {
    const element = imageRef.current;

    if (!element) {
      return undefined;
    }

    let isCancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isCancelled) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.01,
      },
    );

    observer.observe(element);

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, isInView]);

  const hasExhaustedCandidates = sourceIndex >= imageCandidates.length;

  return (
    <div
      ref={imageRef}
      className={`gallery-item ${isVideo ? "is-video" : ""}`}
      onClick={onClick}
    >
      {shouldLoad && activeImageSrc && !hasExhaustedCandidates ? (
        <>
          <img
            src={activeImageSrc}
            alt={alt || imageObj?.name || ""}
            loading="lazy"
            decoding="async"
            onError={() => {
              setSourceIndex((previousIndex) => previousIndex + 1);
            }}
          />
          {isVideo && (
            <div className="gallery-video-indicator">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </>
      ) : hasExhaustedCandidates ? (
        <div className="gallery-item-failed">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>{imageObj?.name || "Foto"}</span>
        </div>
      ) : (
        <div className="gallery-item-placeholder" aria-hidden="true" />
      )}
      <div className="gallery-item-overlay"></div>
    </div>
  );
};

const GalleryFolderCard = ({ folder, onClick }) => {
  const resolvedImageUrl = folder?.imageUrl || folder?.images?.[0] || "";
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageCandidates = useMemo(
    () => buildImageCandidates(resolvedImageUrl, folder),
    [resolvedImageUrl, folder],
  );
  const activeImageSrc = imageCandidates[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [resolvedImageUrl]);

  return (
    <article className="gallery-folder-card" onClick={() => onClick(folder)}>
      <div className="gallery-folder-card-image">
        {activeImageSrc ? (
          <img
            src={activeImageSrc}
            alt={folder.title}
            loading="lazy"
            decoding="async"
            onError={() => {
              setSourceIndex((previousIndex) => previousIndex + 1);
            }}
          />
        ) : (
          <div className="gallery-folder-card-placeholder" aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ opacity: 0.4 }}
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        )}
        <div className="gallery-folder-card-overlay" />
        <span className="gallery-folder-card-tag">
          <i className="fas fa-folder-open"></i>
          <span>Sub-Folder</span>
        </span>
      </div>
      <div className="gallery-folder-card-content">
        <h3 className="gallery-folder-card-title">{folder.title}</h3>
        <div className="gallery-folder-card-footer">
          <span className="gallery-folder-card-link">
            <span>Buka Folder</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

const ModalGalleryImage = ({ image, alt }) => {
  const isVideo = typeof image !== "string" && image?.mimeType?.includes("video");
  const src = typeof image === "string" ? image : image?.url;
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageCandidates = useMemo(
    () => buildImageCandidates(src, image),
    [src, image],
  );
  const activeImageSrc = imageCandidates[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [src, image]);

  if (isVideo && image?.id) {
    return (
      <div className="gallery-modal-video-wrapper">
        <iframe
          src={`https://drive.google.com/file/d/${image.id}/preview`}
          allow="autoplay; fullscreen"
          title={alt || image?.name || "Video preview"}
        />
      </div>
    );
  }

  if (!activeImageSrc) {
    return (
      <div className="gallery-modal-image-placeholder" aria-hidden="true" />
    );
  }

  return (
    <img
      src={activeImageSrc}
      alt={alt || image?.name || ""}
      onError={() => {
        setSourceIndex((previousIndex) => previousIndex + 1);
      }}
    />
  );
};

const GalleryModal = ({
  image,
  onClose,
  onPrev,
  onNext,
  hasMultiple,
  currentIndex,
  totalCount,
  albumTitle,
}) => {
  if (!image) return null;

  const isVideo = typeof image !== "string" && image?.mimeType?.includes("video");
  const fileName = typeof image !== "string" ? image?.name : "";
  const driveId = typeof image !== "string" ? image?.id : "";
  const webContentLink = typeof image !== "string" ? image?.webContentLink : "";

  return (
    <div
      className="gallery-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="gallery-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gallery-modal-header">
          <div className="gallery-modal-header-info">
            <span className={`gallery-modal-badge ${isVideo ? "video" : "photo"}`}>
              <i className={isVideo ? "fas fa-play-circle" : "fas fa-camera"}></i>
              {isVideo ? "Video" : "Foto"}
            </span>
            <div className="gallery-modal-title-group">
              <h3 className="gallery-modal-title">
                {fileName || albumTitle || "Dokumentasi Media"}
              </h3>
              {hasMultiple && totalCount > 1 && (
                <span className="gallery-modal-counter">
                  {currentIndex + 1} / {totalCount}
                </span>
              )}
            </div>
          </div>

          <div className="gallery-modal-actions">
            {driveId && (
              <a
                href={`https://drive.google.com/file/d/${driveId}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-modal-action-btn"
                title="Buka di Google Drive"
              >
                <i className="fab fa-google-drive"></i>
                <span>Drive</span>
              </a>
            )}
            {webContentLink && !isVideo && (
              <a
                href={webContentLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-modal-action-btn primary"
                title="Unduh Foto"
              >
                <i className="fas fa-download"></i>
                <span>Unduh</span>
              </a>
            )}
            <button
              className="gallery-modal-close-btn"
              onClick={onClose}
              aria-label="Tutup preview"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="gallery-modal-body">
          {hasMultiple && totalCount > 1 && (
            <button
              className="gallery-modal-nav-btn prev"
              onClick={onPrev}
              aria-label="Foto Sebelumnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className="gallery-modal-media-wrapper">
            <ModalGalleryImage image={image} alt={fileName || albumTitle} />
          </div>

          {hasMultiple && totalCount > 1 && (
            <button
              className="gallery-modal-nav-btn next"
              onClick={onNext}
              aria-label="Foto Selanjutnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const loadMoreRequestTimerRef = useRef(null);

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
    const requestTimerId = window.setTimeout(() => {
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
    }, GALLERY_IMAGE_REQUEST_DELAY_MS);

    return () => {
      isCancelled = true;
      window.clearTimeout(requestTimerId);
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
      if (prefetchedPage && Array.isArray(prefetchedPage.images) && prefetchedPage.images.length > 0) {
        // 1. Merge prefetched images into driveImages immediately
        setDriveImages((previousImages) =>
          mergeUniqueImages(previousImages, prefetchedPage.images),
        );

        const tokenAfterPrefetchedPage = prefetchedPage.nextPageToken || "";
        setPrefetchedPage(null);
        setNextPageToken(tokenAfterPrefetchedPage);

        if (!tokenAfterPrefetchedPage) {
          setHasMoreImages(false);
          return;
        }

        // 2. Fetch next batch from API
        const preloadedPage = await getDocumentationImagesById(item.id, {
          pageSize: IMAGE_PAGE_SIZE,
          pageToken: tokenAfterPrefetchedPage,
        });

        // 3. Merge preloadedPage.images into driveImages IMMEDIATELY so page 3 images are shown
        setDriveImages((previousImages) =>
          mergeUniqueImages(previousImages, preloadedPage.images),
        );

        // 4. Save preloadedPage.prefetchedNextPage into buffer for NEXT scroll
        setPrefetchedPage(preloadedPage.prefetchedNextPage || null);
        setNextPageToken(preloadedPage.nextPageToken || "");
        setHasMoreImages(
          Boolean(preloadedPage.nextPageToken) ||
            Boolean(preloadedPage.prefetchedNextPage?.images?.length),
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
          if (loadMoreRequestTimerRef.current) {
            window.clearTimeout(loadMoreRequestTimerRef.current);
          }

          loadMoreRequestTimerRef.current = window.setTimeout(() => {
            loadMoreImages();
          }, LOAD_MORE_REQUEST_DELAY_MS);
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.01,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRequestTimerRef.current) {
        window.clearTimeout(loadMoreRequestTimerRef.current);
      }

      observer.disconnect();
    };
  }, [hasMoreImages, isLoadingItem, loadMoreImages]);

  const childFolders = useMemo(() => {
    const folders = Array.isArray(item?.childFolders) ? item.childFolders : [];

    return [...folders].sort((leftFolder, rightFolder) =>
      (leftFolder?.title || "").localeCompare(rightFolder?.title || "", "id", {
        sensitivity: "base",
      }),
    );
  }, [item?.childFolders]);
  const parentFolderName = useMemo(() => {
    const isIdString = (str) => {
      if (!str || typeof str !== "string") return true;
      const trimmed = str.trim();
      return (
        trimmed === id ||
        (trimmed.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed) && !trimmed.includes(" "))
      );
    };

    const rawCandidates = [
      ...(Array.isArray(location.state?.titlePath) ? location.state.titlePath : []),
      location.state?.parentTitle,
      location.state?.parentFolderName,
      item?.parentTitle,
    ];
    const valid = rawCandidates.filter((p) => !isIdString(p));
    return valid.length > 0 ? valid[valid.length - 1] : "";
  }, [location.state, item?.parentTitle, id]);

  const resolvedTitle = useMemo(() => {
    const isIdString = (str) => {
      if (!str || typeof str !== "string") return true;
      const trimmed = str.trim();
      return (
        trimmed === id ||
        (trimmed.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed) && !trimmed.includes(" "))
      );
    };

    if (item?.title && !isIdString(item.title)) {
      return item.title;
    }
    if (location.state?.item?.title && !isIdString(location.state.item.title)) {
      return location.state.item.title;
    }
    if (location.state?.folderName && !isIdString(location.state.folderName)) {
      return location.state.folderName;
    }
    if (isLoadingItem) {
      return parentFolderName ? `${parentFolderName} / Memuat Sub-folder...` : "Memuat Album...";
    }
    return "Dokumentasi";
  }, [item?.title, location.state, isLoadingItem, parentFolderName, id]);

  const cleanTitlePath = useMemo(() => {
    const isIdString = (str) => {
      if (!str || typeof str !== "string") return true;
      const trimmed = str.trim();
      return (
        trimmed === id ||
        (trimmed.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed) && !trimmed.includes(" "))
      );
    };

    const rawPath = Array.isArray(location.state?.titlePath)
      ? location.state.titlePath
      : location.state?.parentTitle
        ? [location.state.parentTitle]
        : [];
    return rawPath.filter((p) => !isIdString(p));
  }, [location.state, id]);

  const selectedImageIndex = useMemo(() => {
    if (!selectedImage) return -1;
    return galleryImages.findIndex((img) => {
      if (typeof img === "string" && typeof selectedImage === "string") {
        return img === selectedImage;
      }
      return (
        (img?.id && img.id === selectedImage?.id) ||
        img?.url === selectedImage?.url ||
        img === selectedImage
      );
    });
  }, [selectedImage, galleryImages]);

  const handlePrevImage = useCallback(() => {
    if (selectedImageIndex > 0) {
      setSelectedImage(galleryImages[selectedImageIndex - 1]);
    } else if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[galleryImages.length - 1]);
    }
  }, [selectedImageIndex, galleryImages]);

  const handleNextImage = useCallback(() => {
    if (selectedImageIndex >= 0 && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImage(galleryImages[selectedImageIndex + 1]);
    } else if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    }
  }, [selectedImageIndex, galleryImages]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handlePrevImage, handleNextImage]);

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

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/media/documentation");
  };

  const isIdStringHelper = (str) => {
    if (!str || typeof str !== "string") return true;
    const trimmed = str.trim();
    return (
      trimmed === id ||
      (trimmed.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(trimmed) && !trimmed.includes(" "))
    );
  };

  const displayDescription = item?.description || "";
  const isSubfolder = cleanTitlePath.length > 0 || Boolean(parentFolderName);
  const heroTitle = [...cleanTitlePath, resolvedTitle].filter(Boolean).join(" / ");
  const heroCoverUrl =
    item?.imageUrl ||
    item?.images?.[0] ||
    (typeof driveImages[0] === "string"
      ? driveImages[0]
      : driveImages[0]?.url) ||
    "";

  const handleFolderClick = (folder) => {
    const safeTitle = !isIdStringHelper(resolvedTitle) ? resolvedTitle : parentFolderName || "";
    const updatedPath = [...cleanTitlePath, safeTitle].filter(Boolean);

    navigate(`/media/documentation/gallery/${folder.id}`, {
      state: {
        item: folder,
        titlePath: updatedPath,
        parentTitle: safeTitle || "Dokumentasi",
        parentFolderName: safeTitle || "Dokumentasi",
      },
    });
  };

  return (
    <>
      <Navbar />
      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-content">
            <div className="gallery-hero-top-nav">
              <button className="back-button" onClick={handleBackClick}>
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

              <nav className="gallery-breadcrumb">
                <span
                  className="breadcrumb-link"
                  onClick={() => navigate("/media/documentation")}
                >
                  Dokumentasi
                </span>
                {cleanTitlePath.map((pathTitle, idx) => (
                  <span key={idx} className="breadcrumb-step">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="breadcrumb-text">{pathTitle}</span>
                  </span>
                ))}
                <span className="breadcrumb-step current">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span className="breadcrumb-text">{resolvedTitle}</span>
                </span>
              </nav>
            </div>

            {isSubfolder ? (
              <div className="gallery-hero-card">
                <div className="gallery-hero-card-media">
                  {heroCoverUrl ? (
                    <img src={heroCoverUrl} alt={resolvedTitle} />
                  ) : (
                    <div className="gallery-hero-card-media-placeholder">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="gallery-hero-card-tag">
                    <i className="fas fa-folder-open"></i>
                    <span>SUB-FOLDER</span>
                  </div>
                </div>

                <div className="gallery-hero-card-info">
                  <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
                  <h1 className="gallery-hero-card-title">{resolvedTitle}</h1>

                  <div className="gallery-hero-card-stats">
                    {galleryImages.length > 0 && (
                      <span className="hero-stat-pill">
                        <i className="fas fa-camera"></i> {galleryImages.length} Foto & Media
                      </span>
                    )}
                    {childFolders.length > 0 && (
                      <span className="hero-stat-pill">
                        <i className="fas fa-folder"></i> {childFolders.length} Sub-folder
                      </span>
                    )}
                  </div>

                  {displayDescription && (
                    <p className="gallery-hero-card-desc">{displayDescription}</p>
                  )}

                  {item?.driveFolderId && (
                    <a
                      href={`https://drive.google.com/drive/folders/${item.driveFolderId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gallery-drive-button"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 9h18v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 9l2.5-5c.3-.6.9-1 1.5-1h9c.6 0 1.2.4 1.5 1l2.5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Buka di Google Drive
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="gallery-hero-standard">
                <p className="gallery-kicker">
                  <span className="section-tag light">GKJ KEBONARUM KLATEN</span>
                </p>
                <h1 className="gallery-title">
                  Dokumentasi
                  <br />
                  {heroTitle}
                </h1>
                {item?.driveFolderId && (
                  <a
                    href={`https://drive.google.com/drive/folders/${item.driveFolderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-drive-button"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 9h18v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 9l2.5-5c.3-.6.9-1 1.5-1h9c.6 0 1.2.4 1.5 1l2.5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Buka di Google Drive
                  </a>
                )}
                {displayDescription && (
                  <p className="gallery-description">{displayDescription}</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-section-inner">
            {childFolders.length > 0 && (
              <div className="gallery-subfolder-section">
                <div className="gallery-subfolder-header">
                  <h2 className="gallery-subfolder-title">
                    Sub-Folder Dokumentasi ({childFolders.length})
                  </h2>
                  <p className="gallery-subfolder-description">
                    Pilih folder di bawah untuk melihat foto & media di dalamnya.
                  </p>
                </div>
                <div className="gallery-subfolder-grid">
                  {childFolders.map((folder) => (
                    <GalleryFolderCard
                      key={folder.id}
                      folder={folder}
                      onClick={handleFolderClick}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="gallery-grid">
              {isLoadingDriveImages || isLoadingItem ? (
                <GallerySkeleton count={10} />
              ) : galleryImages.length > 0 ? (
                <>
                  {galleryImages.map((image, index) => {
                    const isObj = typeof image !== "string";
                    const src = isObj ? image.url : image;
                    const key = isObj ? image.id || image.url : image;
                    const isVideo = isObj && image?.mimeType?.includes("video");
                    return (
                      <LazyGalleryImage
                        key={key}
                        src={src}
                        imageObj={isObj ? image : null}
                        isVideo={isVideo}
                        alt={isObj ? image.name : ""}
                        onClick={() => handleImageClick(image)}
                        delay={Math.min(index * GALLERY_IMAGE_LOAD_DELAY_MS, 640)}
                      />
                    );
                  })}
                  {isLoadingMoreImages && <GallerySkeleton count={4} />}
                </>
              ) : driveImageError ? (
                <p className="gallery-no-images">{driveImageError}</p>
              ) : childFolders.length === 0 ? (
                <p className="gallery-no-images">Belum ada foto dalam album ini.</p>
              ) : null}
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
      <GalleryModal
        image={selectedImage}
        onClose={closeModal}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        hasMultiple={galleryImages.length > 1}
        currentIndex={selectedImageIndex}
        totalCount={galleryImages.length}
        albumTitle={resolvedTitle}
      />
    </>
  );
};

export default GalleryPage;
