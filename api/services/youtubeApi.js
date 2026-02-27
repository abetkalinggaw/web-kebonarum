const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const YOUTUBE_MEDIA_KEYWORDS = process.env.YOUTUBE_MEDIA_KEYWORDS || "";
const YOUTUBE_MAX_PAGE_SIZE = 200;

console.log("[YouTubeAPI] Initialization:");
console.log("[YouTubeAPI] - API Key configured:", Boolean(YOUTUBE_API_KEY));
console.log(
  "[YouTubeAPI] - Channel ID configured:",
  Boolean(YOUTUBE_CHANNEL_ID),
);
console.log("[YouTubeAPI] - Channel ID value:", YOUTUBE_CHANNEL_ID);

const DEFAULT_MEDIA_KEYWORDS = [
  "live",
  "stream",
  "livestream",
  "siaran",
  "siaran langsung",
  "ibadah",
  "ibadah raya",
  "kebaktian",
  "perayaan",
  "mirungga",
  "peladosan",
  "sakramen",
  "baptis",
];

const EXTRA_MEDIA_KEYWORDS = YOUTUBE_MEDIA_KEYWORDS.split(",")
  .map((keyword) => keyword.trim().toLowerCase())
  .filter(Boolean);

const MEDIA_KEYWORDS = Array.from(
  new Set([...DEFAULT_MEDIA_KEYWORDS, ...EXTRA_MEDIA_KEYWORDS]),
);

const hasYoutubeConfig = () => Boolean(YOUTUBE_API_KEY && YOUTUBE_CHANNEL_ID);
const hasYoutubeChannelId = () => Boolean(YOUTUBE_CHANNEL_ID);

const logYoutubeError = ({ context, error, status = null, details = null }) => {
  const reason = details?.error?.errors?.[0]?.reason || "unknown_reason";
  const message =
    details?.error?.message || error?.message || "Unknown YouTube error";

  console.error(
    `[YouTubeAPI] ${context} failed${status ? ` (status ${status})` : ""}: ${reason} - ${message}`,
  );
};

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const fetchYoutubeApiJson = async ({ path, params, context }) => {
  const query = new URLSearchParams({
    ...params,
    key: YOUTUBE_API_KEY,
  });

  const response = await fetch(`${YOUTUBE_API_BASE_URL}${path}?${query}`);

  if (response.ok) {
    return response.json();
  }

  const errorDetails = await readJsonSafely(response);
  const requestError = new Error(
    `YouTube API request failed with status ${response.status}`,
  );
  requestError.status = response.status;
  requestError.details = errorDetails;

  logYoutubeError({
    context,
    error: requestError,
    status: response.status,
    details: errorDetails,
  });

  throw requestError;
};

const mapVideoItem = ({ id, snippet }) => ({
  id,
  title: snippet?.title || "Untitled Video",
  uploadedAt: snippet?.publishedAt || new Date().toISOString(),
});

const dedupeById = (items) => {
  const uniqueItems = [];
  const seenIds = new Set();

  items.forEach((item) => {
    if (!item?.id || seenIds.has(item.id)) {
      return;
    }

    seenIds.add(item.id);
    uniqueItems.push(item);
  });

  return uniqueItems;
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildMediaKeywordRegex = () => {
  if (!MEDIA_KEYWORDS.length) {
    return /(live|stream|livestream)/i;
  }

  const pattern = MEDIA_KEYWORDS.map((keyword) => escapeRegex(keyword)).join(
    "|",
  );
  return new RegExp(`(${pattern})`, "i");
};

const decodeXmlText = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const extractXmlTagValue = (xml, tagName) => {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match?.[1] ? decodeXmlText(match[1].trim()) : "";
};

const fetchChannelRssVideos = async ({ pageSize = 24 } = {}) => {
  if (!hasYoutubeChannelId()) {
    return [];
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(YOUTUBE_CHANNEL_ID)}`;
  const response = await fetch(feedUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; YouTubeRSSFetcher/1.0; +http://www.youtube.com)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `YouTube RSS request failed with status ${response.status}`,
    );
  }

  const xml = await response.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

  return entries
    .map((entry) => {
      const id = extractXmlTagValue(entry, "yt:videoId");
      const title = extractXmlTagValue(entry, "title") || "Untitled Video";
      const uploadedAt =
        extractXmlTagValue(entry, "published") || new Date().toISOString();

      return {
        id,
        title,
        uploadedAt,
      };
    })
    .filter((item) => Boolean(item.id))
    .slice(0, Math.max(1, Math.min(pageSize, YOUTUBE_MAX_PAGE_SIZE)));
};

const splitRssVideosForSections = ({ videos, livestreamPageSize = 12 }) => {
  const livestreamHintRegex = buildMediaKeywordRegex();

  const livestreamItems = videos.filter((item) =>
    livestreamHintRegex.test(item.title || ""),
  );

  const contentItems = videos.filter(
    (item) => !livestreamHintRegex.test(item.title || ""),
  );

  if (livestreamItems.length > 0) {
    return {
      items: videos,
      contentItems,
      livestreamItems: livestreamItems.slice(
        0,
        Math.max(1, Math.min(livestreamPageSize, 50)),
      ),
    };
  }

  return {
    items: videos,
    contentItems: videos,
    livestreamItems: videos.slice(
      0,
      Math.max(1, Math.min(livestreamPageSize, 50)),
    ),
  };
};

const fetchChannelUploadsPlaylistId = async () => {
  const data = await fetchYoutubeApiJson({
    path: "/channels",
    params: {
      part: "contentDetails",
      id: YOUTUBE_CHANNEL_ID,
    },
    context: "channels.getUploadsPlaylist",
  });

  const channel = Array.isArray(data.items) ? data.items[0] : null;
  return channel?.contentDetails?.relatedPlaylists?.uploads || "";
};

const fetchChannelVideos = async ({ pageSize = 24 } = {}) => {
  if (!hasYoutubeConfig()) {
    return [];
  }

  const uploadsPlaylistId = await fetchChannelUploadsPlaylistId();

  if (!uploadsPlaylistId) {
    return [];
  }

  const targetSize = Math.max(1, Math.min(pageSize, YOUTUBE_MAX_PAGE_SIZE));
  const mappedVideos = [];
  let pageToken = "";

  while (mappedVideos.length < targetSize) {
    const remaining = targetSize - mappedVideos.length;
    const maxResults = Math.max(1, Math.min(remaining, 50));

    const data = await fetchYoutubeApiJson({
      path: "/playlistItems",
      params: {
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: String(maxResults),
        ...(pageToken ? { pageToken } : {}),
      },
      context: "playlistItems.list",
    });

    const items = Array.isArray(data.items) ? data.items : [];

    mappedVideos.push(
      ...items
        .map((item) =>
          mapVideoItem({
            id: item?.snippet?.resourceId?.videoId,
            snippet: item?.snippet,
          }),
        )
        .filter((item) => Boolean(item.id)),
    );

    if (!data.nextPageToken || !items.length) {
      break;
    }

    pageToken = data.nextPageToken;
  }

  return dedupeById(mappedVideos).slice(0, targetSize);
};

const fetchChannelLivestreamByEventType = async ({
  eventType,
  pageSize = 12,
}) => {
  if (!hasYoutubeConfig()) {
    return [];
  }

  const data = await fetchYoutubeApiJson({
    path: "/search",
    params: {
      part: "snippet",
      channelId: YOUTUBE_CHANNEL_ID,
      type: "video",
      eventType,
      order: "date",
      maxResults: String(Math.max(1, Math.min(pageSize, 6))),
    },
    context: `search.${eventType}`,
  });

  const items = Array.isArray(data.items) ? data.items : [];

  return items
    .map((item) =>
      mapVideoItem({
        id: item?.id?.videoId,
        snippet: item?.snippet,
      }),
    )
    .filter((item) => Boolean(item.id));
};

const fetchPastLivestreams = async ({ pageSize = 12 } = {}) =>
  fetchChannelLivestreamByEventType({
    eventType: "completed",
    pageSize: Math.max(1, Math.min(pageSize, 6)),
  });

const fetchLiveAndUpcomingLivestreams = async ({ pageSize = 12 } = {}) => {
  const [liveItems, upcomingItems] = await Promise.all([
    fetchChannelLivestreamByEventType({
      eventType: "live",
      pageSize: 3,
    }),
    fetchChannelLivestreamByEventType({
      eventType: "upcoming",
      pageSize: 3,
    }),
  ]);

  return dedupeById([...liveItems, ...upcomingItems]);
};

module.exports = {
  hasYoutubeConfig,
  hasYoutubeChannelId,
  logYoutubeError,
  fetchChannelVideos,
  fetchPastLivestreams,
  fetchLiveAndUpcomingLivestreams,
  fetchChannelRssVideos,
  splitRssVideosForSections,
};
