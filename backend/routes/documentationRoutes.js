const express = require("express");
const {
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
} = require("../services/googleDriveApi");

const router = express.Router();

const foldersToItems = (folders, coverMap) =>
  folders.map((folder) =>
    mapFolderToDocumentationItem({
      folder,
      imageUrl: coverMap[folder.id] || "",
    }),
  );

router.get("/", async (req, res) => {
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
    // Fetch current page folders and (if available) next page folders in parallel
    const currentPage = await fetchDriveChildFolderPage({
      folderId: rootFolderId,
      pageSize,
      pageToken,
    });

    let nextPage = null;
    if (currentPage.nextPageToken) {
      try {
        nextPage = await fetchDriveChildFolderPage({
          folderId: rootFolderId,
          pageSize,
          pageToken: currentPage.nextPageToken,
        });
      } catch (prefetchError) {
        logDriveError({
          context: "documentation.list.prefetch",
          error: prefetchError,
        });
      }
    }

    // Collect all folder IDs from both pages and fetch all covers in ONE request
    const allFolders = [...currentPage.folders, ...(nextPage?.folders || [])];
    const allFolderIds = allFolders.map((f) => f.id);

    let coverMap = {};
    if (allFolderIds.length) {
      try {
        coverMap = await fetchDriveFolderCoversMap(allFolderIds);
      } catch (error) {
        logDriveError({ context: "documentation.list.covers", error });
      }
    }

    const items = foldersToItems(currentPage.folders, coverMap);

    const prefetchedNextPage = nextPage
      ? {
          items: foldersToItems(nextPage.folders, coverMap),
          nextPageToken: nextPage.nextPageToken,
        }
      : null;

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

router.get("/:id", async (req, res) => {
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

router.get("/:id/images", async (req, res) => {
  const folderId = req.params.id;
  const requestedPageSize = Number(req.query.pageSize || 12);
  const pageSize = Number.isFinite(requestedPageSize)
    ? Math.max(1, Math.min(requestedPageSize, 50))
    : 12;
  const pageToken = String(req.query.pageToken || "");

  if (!folderId || !hasGoogleDriveApiKey()) {
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

module.exports = router;
