import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DocumentationPage.css";
import Navbar from "../../../components/menu/Navbar";
import Footer from "../../../components/menu/Footer";
import { getDocumentationItems } from "../../../services/documentationApi";

const ITEM_PAGE_SIZE = 12;

const mergeUniqueItems = (existingItems, incomingItems) => {
  const existingIds = new Set(existingItems.map((item) => item.id));
  const mergedItems = [...existingItems];

  incomingItems.forEach((item) => {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const DEFAULT_DOCUMENTATION_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="Inter, sans-serif" font-size="44">
        Dokumentasi GKJ Kebonarum
      </text>
    </svg>
  `);

const DocumentationCard = ({ item, imageUrl, onClick }) => {
  const resolvedImageUrl =
    imageUrl || item?.images?.[0] || DEFAULT_DOCUMENTATION_IMAGE;

  return (
    <article className="documentation-card" onClick={() => onClick(item)}>
      <div className="documentation-card-image">
        <img
          src={resolvedImageUrl}
          alt={item.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              item?.images?.[0] || DEFAULT_DOCUMENTATION_IMAGE;
          }}
        />
        <div className="documentation-card-overlay" />
        <span className="documentation-card-tag">
          <i className="fas fa-camera"></i>
          <span>Galeri Foto</span>
        </span>
      </div>
      <div className="documentation-card-content">
        <h3 className="documentation-card-title">{item.title}</h3>
        <div className="documentation-card-footer">
          <span className="documentation-card-link">
            <span>Buka Album</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="doc-arrow-icon"
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

const DocumentationSkeleton = ({ count = 8 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <article
        key={index}
        className="documentation-card documentation-card-skeleton"
      >
        <div className="documentation-card-image documentation-skeleton-block" />
        <div className="documentation-card-content">
          <div className="documentation-skeleton-line documentation-skeleton-title" />
        </div>
      </article>
    ))}
  </>
);

const DocumentationPage = () => {
  const navigate = useNavigate();
  const [documentationItems, setDocumentationItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");
  const [prefetchedPage, setPrefetchedPage] = useState(null);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const loadMoreRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    const loadDocumentationItems = async () => {
      setIsLoadingItems(true);
      setDocumentationItems([]);
      setNextPageToken("");
      setPrefetchedPage(null);
      setHasMoreItems(false);

      try {
        const firstPage = await getDocumentationItems({
          pageSize: ITEM_PAGE_SIZE,
        });

        if (!isCancelled) {
          setDocumentationItems(firstPage.items);
          setNextPageToken(firstPage.nextPageToken || "");
          setPrefetchedPage(firstPage.prefetchedNextPage || null);
          setHasMoreItems(
            Boolean(firstPage.nextPageToken) ||
              Boolean(firstPage.prefetchedNextPage?.items?.length),
          );
        }
      } catch (error) {
        if (!isCancelled) {
          setDocumentationItems([]);
          setNextPageToken("");
          setPrefetchedPage(null);
          setHasMoreItems(false);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingItems(false);
        }
      }
    };

    loadDocumentationItems();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    let nextItems = documentationItems;

    if (searchQuery) {
      nextItems = nextItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return [...nextItems].sort((a, b) =>
      b.title.localeCompare(a.title, "id", { sensitivity: "base" }),
    );
  }, [documentationItems, searchQuery]);

  const loadMoreItems = useCallback(async () => {
    if (!hasMoreItems || isLoadingItems || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMoreItems(true);

    try {
      if (prefetchedPage && prefetchedPage.items.length > 0) {
        setDocumentationItems((previousItems) =>
          mergeUniqueItems(previousItems, prefetchedPage.items),
        );

        const tokenAfterPrefetchedPage = prefetchedPage.nextPageToken || "";
        setNextPageToken(tokenAfterPrefetchedPage);
        setPrefetchedPage(null);

        if (!tokenAfterPrefetchedPage) {
          setHasMoreItems(false);
          return;
        }

        const preloadedPage = await getDocumentationItems({
          pageSize: ITEM_PAGE_SIZE,
          pageToken: tokenAfterPrefetchedPage,
        });

        setPrefetchedPage({
          items: preloadedPage.items,
          nextPageToken: preloadedPage.nextPageToken,
        });
        setHasMoreItems(
          preloadedPage.items.length > 0 ||
            Boolean(preloadedPage.nextPageToken),
        );
        return;
      }

      if (!nextPageToken) {
        setHasMoreItems(false);
        return;
      }

      const page = await getDocumentationItems({
        pageSize: ITEM_PAGE_SIZE,
        pageToken: nextPageToken,
      });

      setDocumentationItems((previousItems) =>
        mergeUniqueItems(previousItems, page.items),
      );
      setNextPageToken(page.nextPageToken || "");
      setPrefetchedPage(page.prefetchedNextPage || null);
      setHasMoreItems(
        Boolean(page.nextPageToken) ||
          Boolean(page.prefetchedNextPage?.items?.length),
      );
    } catch (error) {
      setHasMoreItems(false);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMoreItems(false);
    }
  }, [hasMoreItems, isLoadingItems, nextPageToken, prefetchedPage]);

  useEffect(() => {
    if (!hasMoreItems || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          loadMoreItems();
        }
      },
      {
        root: null,
        rootMargin: "220px",
        threshold: 0.01,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreItems, loadMoreItems]);

  const handleCardClick = (item) => {
    if (!item?.id) {
      return;
    }

    navigate(`/media/documentation/gallery/${item.id}`, {
      state: { item },
    });
  };

  return (
    <>
      <Navbar />
      <main className="documentation-page">
        <section className="documentation-hero">
          <div className="documentation-hero-content">
            <span className="section-tag light">GALERI & MEDIA</span>
            <h1 className="documentation-title">
              Dokumentasi Kegiatan
            </h1>
            <p className="documentation-lead">
              Arsip dan rekaman momen pelayanan, ibadah, serta kegiatan kemasyarakatan jemaat GKJ Kebonarum.
            </p>
          </div>
        </section>

        <section className="documentation-controls">
          <div className="documentation-controls-inner">
            <div className="documentation-search">
              <input
                type="text"
                className="documentation-search-input"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="documentation-search-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </section>

        <section className="documentation-section">
          <div className="documentation-section-inner">
            <div className="documentation-grid">
              {isLoadingItems && documentationItems.length === 0 ? (
                <DocumentationSkeleton />
              ) : filteredItems.length > 0 ? (
                <>
                  {filteredItems.map((item) => (
                    <DocumentationCard
                      key={item.id}
                      item={item}
                      imageUrl={item.imageUrl}
                      onClick={handleCardClick}
                    />
                  ))}
                  {isLoadingMoreItems && <DocumentationSkeleton count={4} />}
                </>
              ) : (
                <DocumentationSkeleton count={4} />
              )}
            </div>
            {hasMoreItems && <div ref={loadMoreRef} aria-hidden="true" />}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DocumentationPage;
