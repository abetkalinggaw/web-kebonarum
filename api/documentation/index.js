const { corsMiddleware, runMiddleware } = require("../cors");

const {
  hasGoogleDriveApiKey,
  logDriveError,
  isReferrerRestrictedApiKeyError,
  resolveFolderId,
  fetchDriveFileById,
  fetchDriveFolderCoverUrl,
  fetchDriveFolderImagePage,
  fetchDriveChildFolderPage,
  mapFolderToDocumentationItem,
} = require("../../backend/services/googleDriveApi");

module.exports = async (req, res) => {
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
};
