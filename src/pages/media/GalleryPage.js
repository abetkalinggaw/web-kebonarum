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
const GALLERY_IMAGE_LOAD_DELAY_MS = 80;
const GALLERY_IMAGE_REQUEST_DELAY_MS = 140;
const LOAD_MORE_REQUEST_DELAY_MS = 180;

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

const buildImageCandidates = (url = "") => {
  const fileId = extractDriveFileId(url);
  const candidates = [];

  if (url) {
    candidates.push(url);
  }

  if (fileId) {
    candidates.push(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`);
    candidates.push(`https://drive.google.com/uc?export=view&id=${fileId}`);
    candidates.push(`https://lh3.googleusercontent.com/d/${fileId}=w1600`);
  }

  return [...new Set(candidates.filter(Boolean))];
};

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

const LazyGalleryImage = ({ src, alt, onClick, delay = 0 }) => {
  const imageRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageCandidates = useMemo(() => buildImageCandidates(src), [src]);
  const activeImageSrc = imageCandidates[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [src]);

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
        rootMargin: "240px",
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

  return (
    <div ref={imageRef} className="gallery-item" onClick={onClick}>
      {shouldLoad && activeImageSrc ? (
        <img
          src={activeImageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => {
            setSourceIndex((previousIndex) =>
              previousIndex + 1 < imageCandidates.length
                ? previousIndex + 1
                : imageCandidates.length,
            );
          }}
        />
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
    () => buildImageCandidates(resolvedImageUrl),
    [resolvedImageUrl],
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
              setSourceIndex((previousIndex) =>
                previousIndex + 1 < imageCandidates.length
                  ? previousIndex + 1
                  : imageCandidates.length,
              );
            }}
          />
        ) : (
          <div className="gallery-folder-card-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="gallery-folder-card-content">
        <h3 className="gallery-folder-card-title">{folder.title}</h3>
      </div>
    </article>
  );
};

const ModalGalleryImage = ({ src, alt }) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageCandidates = useMemo(() => buildImageCandidates(src), [src]);
  const activeImageSrc = imageCandidates[sourceIndex] || "";

  useEffect(() => {
    setSourceIndex(0);
  }, [src]);

  if (!activeImageSrc) {
    return (
      <div className="gallery-modal-image-placeholder" aria-hidden="true" />
    );
  }

  return (
    <img
      src={activeImageSrc}
      alt={alt}
      onError={() => {
        setSourceIndex((previousIndex) =>
          previousIndex + 1 < imageCandidates.length
            ? previousIndex + 1
            : imageCandidates.length,
        );
      }}
    />
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
        rootMargin: "240px",
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

  const displayTitle = item?.title || "";
  const displayDescription = item?.description || "";
  const titlePath = Array.isArray(location.state?.titlePath)
    ? location.state.titlePath
    : location.state?.parentTitle
      ? [location.state.parentTitle]
      : [];
  const heroTitle = [...titlePath, displayTitle].filter(Boolean).join(" / ");
  const shouldShowImageSkeleton =
    isLoadingDriveImages &&
    galleryImages.length === 0 &&
    childFolders.length === 0;

  const handleFolderClick = (folder) => {
    navigate(`/media/documentation/gallery/${folder.id}`, {
      state: { item: folder, titlePath: [...titlePath, displayTitle] },
    });
  };

  return (
    <>
      <Navbar />
      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-content">
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
            <p className="gallery-kicker">GKJ Kebonarum Klaten</p>
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
                Link Google Drive
              </a>
            )}
            {displayDescription && (
              <p className="gallery-description">{displayDescription}</p>
            )}
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-section-inner">
            {childFolders.length > 0 && (
              <div className="gallery-subfolder-section">
                <div className="gallery-subfolder-header">
                  <h2 className="gallery-subfolder-title">
                    Folder di dalam folder ini
                  </h2>
                  <p className="gallery-subfolder-description">
                    Buka folder lain yang tersimpan di dalam dokumentasi ini.
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
              {shouldShowImageSkeleton ? (
                <GallerySkeleton count={10} />
              ) : galleryImages.length > 0 ? (
                <>
                  {galleryImages.map((image, index) => (
                    <LazyGalleryImage
                      key={image}
                      src={image}
                      alt=""
                      onClick={() => handleImageClick(image)}
                      delay={Math.min(index * GALLERY_IMAGE_LOAD_DELAY_MS, 640)}
                    />
                  ))}
                  {isLoadingMoreImages && <GallerySkeleton count={4} />}
                </>
              ) : driveImageError ? (
                <p className="gallery-no-images">{driveImageError}</p>
              ) : childFolders.length > 0 ? null : (
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
            <button
              className="gallery-modal-close"
              onClick={closeModal}
            ></button>
            <ModalGalleryImage src={selectedImage} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
