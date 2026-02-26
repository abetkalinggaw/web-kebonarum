const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5050;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

if (FRONTEND_ORIGIN) {
  app.use(cors({ origin: FRONTEND_ORIGIN }));
} else {
  app.use(cors());
}

app.use(express.json());

const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const GOOGLE_DRIVE_ROOT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
  "1u8W7fIhWNg4Hlh6y165AhWo1NcpuzSEW";
const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3/files";

// const createDriveThumbnailUrl = (fileId, size = 1200) =>
//   `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;

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
  if (!GOOGLE_DRIVE_API_KEY) {
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

  return firstImage?.id ? createDriveThumbnailUrl(firstImage.id, 1200) : null;
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
    images: imageFiles.map((file) => createDriveThumbnailUrl(file.id, 1600)),
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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/documentation", async (req, res) => {
  const rootFolderId = resolveFolderId("");
  const requestedPageSize = Number(req.query.pageSize || 12);
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.max(1, Math.min(requestedPageSize, 50))
    : 12;
  const pageToken = String(req.query.pageToken || "");

  if (!rootFolderId) {
    return res.json({
      items: [],
      nextPageToken: "",
      pageSize,
      prefetchedNextPage: null,
    });
  }

  try {
    const currentPage = await fetchDriveChildFolderPage({
      folderId: rootFolderId,
      pageSize,
      pageToken,
    });

    const items = await Promise.all(
      currentPage.folders.map(async (folder) => {
        try {
          const coverUrl = await fetchDriveFolderCoverUrl(folder.id);
          return mapFolderToDocumentationItem({
            folder,
            imageUrl: coverUrl || "",
          });
        } catch (error) {
          return mapFolderToDocumentationItem({ folder });
        }
      }),
    );

    let prefetchedNextPage = null;

    if (currentPage.nextPageToken) {
      try {
        const nextPage = await fetchDriveChildFolderPage({
          folderId: rootFolderId,
          pageSize,
          pageToken: currentPage.nextPageToken,
        });

        const prefetchedItems = await Promise.all(
          nextPage.folders.map(async (folder) => {
            try {
              const coverUrl = await fetchDriveFolderCoverUrl(folder.id);
              return mapFolderToDocumentationItem({
                folder,
                imageUrl: coverUrl || "",
              });
            } catch (error) {
              return mapFolderToDocumentationItem({ folder });
            }
          }),
        );

        prefetchedNextPage = {
          items: prefetchedItems,
          nextPageToken: nextPage.nextPageToken,
        };
      } catch (prefetchError) {
        logDriveError({
          context: "documentation.list.prefetch",
          error: prefetchError,
        });
      }
    }

    return res.json({
      items,
      nextPageToken: currentPage.nextPageToken,
      pageSize,
      prefetchedNextPage,
    });
  } catch (error) {
    logDriveError({
      context: "documentation.list",
      error,
    });
    return res.status(502).json({
      message: "Failed to fetch documentation folders from Google Drive",
      items: [],
      nextPageToken: "",
      pageSize,
      prefetchedNextPage: null,
    });
  }
});

app.get("/api/documentation/:id", async (req, res) => {
  const folderId = req.params.id;

  if (!folderId) {
    return res.status(400).json({ message: "Folder id is required" });
  }

  try {
    const folder = await fetchDriveFileById(
      folderId,
      "id,name,mimeType,createdTime,modifiedTime",
    );

    if (folder.mimeType !== "application/vnd.google-apps.folder") {
      return res
        .status(404)
        .json({ message: "Documentation folder not found" });
    }

    let coverUrl = "";
    try {
      coverUrl = (await fetchDriveFolderCoverUrl(folderId)) || "";
    } catch (error) {
      coverUrl = "";
    }

    return res.json(
      mapFolderToDocumentationItem({ folder, imageUrl: coverUrl }),
    );
  } catch (error) {
    if (error?.status === 404 || error?.message?.includes("status 404")) {
      return res
        .status(404)
        .json({ message: "Documentation folder not found" });
    }

    if (isReferrerRestrictedApiKeyError(error)) {
      return res.status(500).json({
        message:
          "Google Drive API key is still restricted to HTTP referrers. Use a backend-compatible key restriction (or unrestricted key) for server requests.",
      });
    }

    logDriveError({
      context: "documentation.get",
      error,
    });
    return res.status(502).json({ message: "Failed to fetch folder metadata" });
  }
});

app.get("/api/documentation/:id/images", async (req, res) => {
  const folderId = req.params.id;
  const requestedPageSize = Number(req.query.pageSize || 12);
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.max(1, Math.min(requestedPageSize, 50))
    : 12;
  const pageToken = String(req.query.pageToken || "");

  if (!folderId || !GOOGLE_DRIVE_API_KEY) {
    return res.json({
      images: [],
      nextPageToken: "",
      pageSize,
      prefetchedNextPage: null,
    });
  }

  try {
    const currentPage = await fetchDriveFolderImagePage({
      folderId,
      pageSize,
      pageToken,
    });

    let prefetchedNextPage = null;

    if (currentPage.nextPageToken) {
      try {
        const nextPage = await fetchDriveFolderImagePage({
          folderId,
          pageSize,
          pageToken: currentPage.nextPageToken,
        });

        prefetchedNextPage = {
          images: nextPage.images,
          nextPageToken: nextPage.nextPageToken,
        };
      } catch (prefetchError) {
        logDriveError({
          context: "documentation.images.prefetch",
          error: prefetchError,
        });
      }
    }

    return res.json({
      images: currentPage.images,
      nextPageToken: currentPage.nextPageToken,
      pageSize,
      prefetchedNextPage,
    });
  } catch (error) {
    logDriveError({
      context: "documentation.images",
      error,
    });
    return res.status(502).json({
      message: "Failed to fetch images from Google Drive",
      images: [],
      nextPageToken: "",
      pageSize,
      prefetchedNextPage: null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
