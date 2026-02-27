const {
  GOOGLE_DRIVE_API_KEY,
  GOOGLE_DRIVE_ROOT_FOLDER_ID,
  GOOGLE_DRIVE_API_BASE_URL,
} = require("../config/googleDriveConfig");

const hasGoogleDriveApiKey = () => Boolean(GOOGLE_DRIVE_API_KEY);

const createDriveThumbnailUrl = (fileId) =>
  `https://lh3.googleusercontent.com/d/${fileId}=w1600`;

const buildFolderImageQuery = (folderId) =>
  `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;

const buildChildFolderQuery = (folderId) =>
  `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

const resolveFolderId = (folderId) => folderId || GOOGLE_DRIVE_ROOT_FOLDER_ID;

const logDriveError = ({ context, error, status = null, details = null }) => {
  const reason = details?.error?.errors?.[0]?.reason || "unknown_reason";
  const message =
    details?.error?.message || error?.message || "Unknown Google Drive error";

  console.error(
    `[DriveAPI] ${context} failed${status ? ` (status ${status})` : ""}: ${reason} - ${message}`,
  );
};

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const isReferrerRestrictedApiKeyError = (error) => {
  if (!error || error.status !== 403 || !error.details) {
    return false;
  }

  const detailReasons = Array.isArray(error.details?.error?.details)
    ? error.details.error.details.map((detail) => detail?.reason)
    : [];

  if (detailReasons.includes("API_KEY_HTTP_REFERRER_BLOCKED")) {
    return true;
  }

  const message = error.details?.error?.message || "";
  return /referer/i.test(message);
};

const fetchDriveApiJson = async ({ url, context }) => {
  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  const errorDetails = await readJsonSafely(response);
  const requestError = new Error(
    `Drive API request failed with status ${response.status}`,
  );
  requestError.status = response.status;
  requestError.details = errorDetails;

  logDriveError({
    context,
    error: requestError,
    status: response.status,
    details: errorDetails,
  });

  throw requestError;
};

const fetchDriveFiles = async ({
  query,
  pageSize = 1000,
  orderBy = "createdTime desc",
  fields = "nextPageToken,files(id,name,mimeType,createdTime)",
  pageToken = "",
}) => {
  if (!hasGoogleDriveApiKey()) {
    throw new Error("Google Drive API key is not set");
  }

  const params = new URLSearchParams({
    q: query,
    fields,
    pageSize: String(pageSize),
    orderBy,
    key: GOOGLE_DRIVE_API_KEY,
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  return fetchDriveApiJson({
    url: `${GOOGLE_DRIVE_API_BASE_URL}?${params}`,
    context: "files.list",
  });
};

const fetchDriveFileById = async (fileId, fields) => {
  const params = new URLSearchParams({
    fields,
    key: GOOGLE_DRIVE_API_KEY,
  });

  return fetchDriveApiJson({
    url: `${GOOGLE_DRIVE_API_BASE_URL}/${fileId}?${params.toString()}`,
    context: "files.get",
  });
};

const fetchDriveFolderCoverUrl = async (folderId) => {
  const data = await fetchDriveFiles({
    query: buildFolderImageQuery(folderId),
    pageSize: 1,
    orderBy: "createdTime",
    fields: "files(id,mimeType,createdTime)",
  });

  const files = Array.isArray(data.files) ? data.files : [];
  const firstImage = files.find((file) => file?.id);

  return firstImage?.id ? createDriveThumbnailUrl(firstImage.id) : null;
};

/**
 * Fetches cover images for multiple folders in a single API call.
 * Returns a map of { folderId -> thumbnailUrl }.
 */
const fetchDriveFolderCoversMap = async (folderIds) => {
  if (!folderIds.length) return {};

  const query = `(${folderIds.map((id) => `'${id}' in parents`).join(" or ")}) and mimeType contains 'image/' and trashed=false`;

  const data = await fetchDriveFiles({
    query,
    pageSize: folderIds.length, // at most 1 cover image needed per folder
    orderBy: "createdTime",
    fields: "files(id,parents,mimeType,createdTime)",
  });

  const files = Array.isArray(data.files) ? data.files : [];

  // Keep only the first image found per folder
  const coverMap = {};
  for (const file of files) {
    const parentId = file.parents?.[0];
    if (parentId && !coverMap[parentId] && file.id) {
      coverMap[parentId] = createDriveThumbnailUrl(file.id);
    }
  }

  return coverMap;
};

const fetchDriveFolderImagePage = async ({
  folderId,
  pageSize = 8,
  pageToken = "",
}) => {
  const data = await fetchDriveFiles({
    query: buildFolderImageQuery(folderId),
    pageSize,
    fields: "nextPageToken,files(id,mimeType,name,createdTime)",
    pageToken,
  });

  const files = Array.isArray(data.files) ? data.files : [];
  const imageFiles = files.filter((file) => file?.id);

  return {
    images: imageFiles.map((file) => createDriveThumbnailUrl(file.id)),
    nextPageToken: data.nextPageToken || "",
  };
};

const fetchDriveChildFolderPage = async ({
  folderId,
  pageSize = 8,
  pageToken = "",
}) => {
  const data = await fetchDriveFiles({
    query: buildChildFolderQuery(folderId),
    pageSize,
    fields: "nextPageToken,files(id,name,mimeType,createdTime,modifiedTime)",
    pageToken,
  });

  const files = Array.isArray(data.files) ? data.files : [];
  const folders = files.filter((file) => file?.id);

  return {
    folders,
    nextPageToken: data.nextPageToken || "",
  };
};

const mapFolderToDocumentationItem = ({ folder, imageUrl = "" }) => ({
  id: folder.id,
  driveFolderId: folder.id,
  title: folder.name || "Untitled Folder",
  description: "",
  category: "Google Drive",
  date: folder.createdTime || folder.modifiedTime || new Date().toISOString(),
  imageUrl,
  images: [],
});

module.exports = {
  hasGoogleDriveApiKey,
  logDriveError,
  isReferrerRestrictedApiKeyError,
  resolveFolderId,
  fetchDriveFileById,
  fetchDriveFolderCoverUrl,
  fetchDriveFolderCoversMap,
  fetchDriveFolderImagePage,
  fetchDriveChildFolderPage,
  mapFolderToDocumentationItem,
};
