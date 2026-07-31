const GOOGLE_DRIVE_API_KEY =
  process.env.GOOGLE_DRIVE_API_KEY || process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;
const GOOGLE_DRIVE_ROOT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
  "1u8W7fIhWNg4Hlh6y165AhWo1NcpuzSEW";
const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3/files";

const hasGoogleDriveApiKey = () => Boolean(GOOGLE_DRIVE_API_KEY);

const createDriveThumbnailUrl = (fileOrId) => {
  if (!fileOrId) return "";
  if (typeof fileOrId === "object") {
    if (fileOrId.thumbnailLink) {
      return fileOrId.thumbnailLink
        .replace(/=s\d+/, "=s1600")
        .replace(/=w\d+/, "=w1600");
    }
    return fileOrId.id ? `https://lh3.googleusercontent.com/d/${fileOrId.id}=w1600` : "";
  }
  return `https://lh3.googleusercontent.com/d/${fileOrId}=w1600`;
};

const buildFolderImageQuery = (folderId) =>
  `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/') and trashed=false`;

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

const getDriveErrorReason = (details) =>
  details?.error?.errors?.[0]?.reason || "unknown_reason";

const isExpectedDrivePermissionError = (error, details) => {
  const reason = getDriveErrorReason(details || error?.details);
  return error?.status === 403 && reason === "insufficientFilePermissions";
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

  if (!isExpectedDrivePermissionError(requestError, errorDetails)) {
    logDriveError({
      context,
      error: requestError,
      status: response.status,
      details: errorDetails,
    });
  }

  throw requestError;
};

const fetchDriveFiles = async ({
  query,
  pageSize = 1000,
  orderBy = "createdTime desc",
  fields = "nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink,createdTime,modifiedTime)",
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
    fields: fields || "id,name,mimeType,thumbnailLink,webContentLink,createdTime,modifiedTime",
    key: GOOGLE_DRIVE_API_KEY,
  });

  return fetchDriveApiJson({
    url: `${GOOGLE_DRIVE_API_BASE_URL}/${fileId}?${params.toString()}`,
    context: "files.get",
  });
};

const fetchDriveFolderCoverUrl = async (folderId, depth = 0) => {
  if (!folderId) return null;

  try {
    const data = await fetchDriveFiles({
      query: buildFolderImageQuery(folderId),
      pageSize: 1,
      orderBy: "createdTime",
      fields: "files(id,mimeType,thumbnailLink,createdTime)",
    });

    const files = Array.isArray(data.files) ? data.files : [];
    const firstImage = files.find((file) => file?.id);

    if (firstImage?.id) {
      return createDriveThumbnailUrl(firstImage);
    }

    if (depth < 2) {
      const childFolderPage = await fetchDriveChildFolderPage({
        folderId,
        pageSize: 3,
      });

      for (const childFolder of childFolderPage.folders) {
        const childCover = await fetchDriveFolderCoverUrl(childFolder.id, depth + 1);
        if (childCover) {
          return childCover;
        }
      }
    }
  } catch (error) {
    // Return null on failure
  }

  return null;
};

const fetchDriveFirstChildFolderCoverUrl = async (folderId) => {
  const childFolderPage = await fetchDriveChildFolderPage({
    folderId,
    pageSize: 1,
  });

  const firstChildFolder = childFolderPage.folders.find((folder) => folder?.id);

  if (!firstChildFolder?.id) {
    return null;
  }

  return fetchDriveFolderCoverUrl(firstChildFolder.id);
};

const fetchDriveFolderCoversMap = async (folderIds) => {
  if (!folderIds.length) return {};

  const CHUNK_SIZE = 20;
  const coverMap = {};

  try {
    for (let i = 0; i < folderIds.length; i += CHUNK_SIZE) {
      const chunk = folderIds.slice(i, i + CHUNK_SIZE);
      const query = `(${chunk
        .map((id) => `'${id}' in parents`)
        .join(" or ")}) and (mimeType contains 'image/' or mimeType contains 'video/') and trashed=false`;

      const data = await fetchDriveFiles({
        query,
        pageSize: chunk.length,
        orderBy: "createdTime",
        fields: "files(id,parents,mimeType,thumbnailLink,createdTime)",
      });

      const files = Array.isArray(data.files) ? data.files : [];

      const parentsAvailable = files.some(
        (file) => Array.isArray(file.parents) && file.parents.length > 0,
      );

      if (files.length === 0 || !parentsAvailable) {
        const results = await Promise.allSettled(
          chunk.map(async (folderId) => ({
            folderId,
            url: await fetchDriveFolderCoverUrl(folderId),
          })),
        );

        for (const result of results) {
          if (result.status === "fulfilled" && result.value.url) {
            coverMap[result.value.folderId] = result.value.url;
          }
        }
      } else {
        for (const file of files) {
          const parentId = file.parents?.[0];
          if (parentId && !coverMap[parentId] && file.id) {
            coverMap[parentId] = createDriveThumbnailUrl(file);
          }
        }
      }
    }

    const missingIds = folderIds.filter((id) => !coverMap[id]);
    if (missingIds.length > 0) {
      const fallbackResults = await Promise.allSettled(
        missingIds.map(async (folderId) => ({
          folderId,
          url: await fetchDriveFolderCoverUrl(folderId),
        })),
      );

      for (const result of fallbackResults) {
        if (result.status === "fulfilled" && result.value.url) {
          coverMap[result.value.folderId] = result.value.url;
        }
      }
    }

    return coverMap;
  } catch (error) {
    if (!isExpectedDrivePermissionError(error)) {
      logDriveError({ context: "fetchDriveFolderCoversMap.batch", error });
    }

    const results = await Promise.allSettled(
      folderIds.map(async (folderId) => ({
        folderId,
        url: await fetchDriveFolderCoverUrl(folderId),
      })),
    );

    const fallbackMap = {};
    for (const result of results) {
      if (result.status === "fulfilled" && result.value.url) {
        fallbackMap[result.value.folderId] = result.value.url;
      }
    }
    return fallbackMap;
  }
};

const fetchDriveFolderImagePage = async ({
  folderId,
  pageSize = 24,
  pageToken = "",
}) => {
  const data = await fetchDriveFiles({
    query: buildFolderImageQuery(folderId),
    pageSize,
    orderBy: "createdTime",
    fields: "nextPageToken,files(id,mimeType,name,thumbnailLink,webContentLink,createdTime)",
    pageToken,
  });

  const files = Array.isArray(data.files) ? data.files : [];
  const imageFiles = files.filter((file) => file?.id);

  return {
    images: imageFiles.map((file) => ({
      url: createDriveThumbnailUrl(file),
      thumbnailLink: file.thumbnailLink || "",
      webContentLink: file.webContentLink || "",
      mimeType: file.mimeType || "",
      id: file.id,
      name: file.name || "",
    })),
    nextPageToken: data.nextPageToken || "",
  };
};

const fetchDriveChildFolderPage = async ({
  folderId,
  pageSize = 24,
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

const isRawDriveId = (str) =>
  typeof str === "string" && /^[a-zA-Z0-9_-]{25,45}$/.test(str);

const mapFolderToDocumentationItem = ({ folder, imageUrl = "" }) => {
  const rawName = folder.name || "";
  const title = !rawName || isRawDriveId(rawName) ? "Album Dokumentasi" : rawName;

  return {
    id: folder.id,
    driveFolderId: folder.id,
    title,
    description: "",
    category: "Google Drive",
    date: folder.createdTime || folder.modifiedTime || new Date().toISOString(),
    imageUrl,
    images: [],
  };
};

module.exports = {
  hasGoogleDriveApiKey,
  logDriveError,
  isReferrerRestrictedApiKeyError,
  resolveFolderId,
  createDriveThumbnailUrl,
  fetchDriveFileById,
  fetchDriveFolderCoverUrl,
  fetchDriveFirstChildFolderCoverUrl,
  fetchDriveFolderCoversMap,
  fetchDriveFolderImagePage,
  fetchDriveChildFolderPage,
  mapFolderToDocumentationItem,
};
