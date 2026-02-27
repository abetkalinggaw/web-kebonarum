const { corsMiddleware, runMiddleware } = require("../cors");

const {
  hasGoogleDriveApiKey,
  logDriveError,
  isReferrerRestrictedApiKeyError,
  fetchDriveFileById,
  fetchDriveFolderCoverUrl,
  fetchDriveFolderImagePage,
  mapFolderToDocumentationItem,
} = require("../../backend/services/googleDriveApi");

module.exports = async (req, res) => {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  // Handle images sub-route
  if (Array.isArray(id) && id[1] === "images") {
    return handleImages(id[0], req, res);
  }

  // Handle folder details
  if (!id || (Array.isArray(id) && !id[0])) {
    return res.status(400).json({ message: "Folder id is required" });
  }

  const folderId = Array.isArray(id) ? id[0] : id;

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
};

async function handleImages(folderId, req, res) {
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
}
