const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const createApiUrl = (path) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }

  return path;
};

const withCacheBuster = (path) => {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}_=${Date.now()}`;
};

const fetchJson = async (path) => {
  const requestInit = {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  };

  let response = await fetch(createApiUrl(path), requestInit);

  if (response.status === 304) {
    response = await fetch(createApiUrl(withCacheBuster(path)), requestInit);
  }

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const getDocumentationItems = async ({
  pageSize = 12,
  pageToken = "",
} = {}) => {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const data = await fetchJson(`/api/documentation?${params}`);

  if (Array.isArray(data)) {
    return {
      items: data,
      nextPageToken: "",
      prefetchedNextPage: null,
    };
  }

  return {
    items: Array.isArray(data.items) ? data.items : [],
    nextPageToken: data.nextPageToken || "",
    prefetchedNextPage:
      data.prefetchedNextPage && Array.isArray(data.prefetchedNextPage.items)
        ? {
            items: data.prefetchedNextPage.items,
            nextPageToken: data.prefetchedNextPage.nextPageToken || "",
          }
        : null,
  };
};

export const getDocumentationItemById = async (id) =>
  fetchJson(`/api/documentation/${id}`);

export const getDocumentationImagesById = async (
  id,
  { pageSize = 12, pageToken = "" } = {},
) => {
  const params = new URLSearchParams({
    pageSize: String(pageSize),
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const data = await fetchJson(`/api/documentation/${id}/images?${params}`);

  return {
    images: Array.isArray(data.images) ? data.images : [],
    nextPageToken: data.nextPageToken || "",
    thumbnailOnlyFiles: Boolean(data.thumbnailOnlyFiles),
    prefetchedNextPage:
      data.prefetchedNextPage && Array.isArray(data.prefetchedNextPage.images)
        ? {
            images: data.prefetchedNextPage.images,
            nextPageToken: data.prefetchedNextPage.nextPageToken || "",
            thumbnailOnlyFiles: Boolean(
              data.prefetchedNextPage.thumbnailOnlyFiles,
            ),
          }
        : null,
  };
};
