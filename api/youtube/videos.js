const { corsMiddleware, runMiddleware } = require("../cors");

const {
  hasYoutubeConfig,
  hasYoutubeChannelId,
  logYoutubeError,
  fetchChannelVideos,
  fetchPastLivestreams,
  fetchLiveAndUpcomingLivestreams,
  fetchChannelRssVideos,
  splitRssVideosForSections,
} = require("../services/youtubeApi");

module.exports = async (req, res) => {
  const requestedPageSize = Number(req.query?.pageSize || 24);
  const requestedLivestreamPageSize = Number(
    req.query?.livestreamPageSize || 12,
  );

  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.max(1, Math.min(requestedPageSize, 200))
    : 24;

  const livestreamPageSize = Number.isFinite(requestedLivestreamPageSize)
    ? Math.max(1, Math.min(requestedLivestreamPageSize, 50))
    : 12;

  try {
    await runMiddleware(req, res, corsMiddleware);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    console.log("[YouTubeAPI] GET /videos request received");

    console.log(
      `[YouTubeAPI] Config check - has config: ${hasYoutubeConfig()}, has channel: ${hasYoutubeChannelId()}`,
    );

    if (!hasYoutubeConfig() && !hasYoutubeChannelId()) {
      console.log("[YouTubeAPI] No YouTube config found, returning empty data");
      return res.json({
        items: [],
        contentItems: [],
        livestreamItems: [],
        liveNowItems: [],
        pageSize,
        livestreamPageSize,
      });
    }

    const [itemsResult, livestreamResult, liveNowResult] =
      await Promise.allSettled([
        fetchChannelVideos({ pageSize }),
        fetchPastLivestreams({ pageSize: livestreamPageSize }),
        fetchLiveAndUpcomingLivestreams({ pageSize: livestreamPageSize }),
      ]);

    if (itemsResult.status === "rejected") {
      logYoutubeError({
        context: "youtube.videos.items",
        error: itemsResult.reason,
        status: itemsResult.reason?.status,
        details: itemsResult.reason?.details,
      });
    }

    if (livestreamResult.status === "rejected") {
      logYoutubeError({
        context: "youtube.videos.livestreamItems",
        error: livestreamResult.reason,
        status: livestreamResult.reason?.status,
        details: livestreamResult.reason?.details,
      });
    }

    if (liveNowResult.status === "rejected") {
      logYoutubeError({
        context: "youtube.videos.liveNowItems",
        error: liveNowResult.reason,
        status: liveNowResult.reason?.status,
        details: liveNowResult.reason?.details,
      });
    }

    let items = itemsResult.status === "fulfilled" ? itemsResult.value : [];
    let livestreamItems =
      livestreamResult.status === "fulfilled" ? livestreamResult.value : [];
    let liveNowItems =
      liveNowResult.status === "fulfilled" ? liveNowResult.value : [];
    let contentItems = null;

    console.log(
      `[YouTubeAPI] Results - items: ${items.length}, livestreamItems: ${livestreamItems.length}, liveNowItems: ${liveNowItems.length}`,
    );

    const hasApi403 = [itemsResult, livestreamResult, liveNowResult].some(
      (result) =>
        result.status === "rejected" && Number(result.reason?.status) === 403,
    );

    const shouldUseRssFallback =
      hasYoutubeChannelId() &&
      (hasApi403 || (!items.length && !livestreamItems.length));

    if (shouldUseRssFallback) {
      try {
        const rssVideos = await fetchChannelRssVideos({
          pageSize: Math.max(pageSize, livestreamPageSize * 2),
        });
        const rssSplit = splitRssVideosForSections({
          videos: rssVideos,
          livestreamPageSize,
        });

        if (!items.length) {
          items = rssSplit.items.slice(0, pageSize);
        }

        if (!contentItems) {
          contentItems = rssSplit.contentItems.slice(0, pageSize);
        }

        if (!livestreamItems.length) {
          livestreamItems = rssSplit.livestreamItems;
        }

        if (!liveNowItems.length && rssSplit.livestreamItems.length > 0) {
          liveNowItems = rssSplit.livestreamItems.slice(0, 1);
        }
        console.log(
          `[YouTubeAPI] RSS fallback - items: ${items.length}, contentItems: ${contentItems?.length ?? 0}, livestreamItems: ${livestreamItems.length}, liveNowItems: ${liveNowItems.length}`,
        );
      } catch (rssError) {
        logYoutubeError({
          context: "youtube.videos.rssFallback",
          error: rssError,
        });
      }
    }

    return res.json({
      items,
      contentItems,
      livestreamItems,
      liveNowItems,
      pageSize,
      livestreamPageSize,
    });
  } catch (error) {
    logYoutubeError({
      context: "youtube.videos.unhandled",
      error,
      status: error?.status,
      details: error?.details,
    });

    return res.status(200).json({
      items: [],
      contentItems: [],
      livestreamItems: [],
      liveNowItems: [],
      pageSize,
      livestreamPageSize,
    });
  }
};
