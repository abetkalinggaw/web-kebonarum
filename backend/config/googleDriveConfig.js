const GOOGLE_DRIVE_API_KEY =
  process.env.GOOGLE_DRIVE_API_KEY || process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;
const GOOGLE_DRIVE_ROOT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
  "1u8W7fIhWNg4Hlh6y165AhWo1NcpuzSEW";
const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3/files";

module.exports = {
  GOOGLE_DRIVE_API_KEY,
  GOOGLE_DRIVE_ROOT_FOLDER_ID,
  GOOGLE_DRIVE_API_BASE_URL,
};

