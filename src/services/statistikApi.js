const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const createApiUrl = (path) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

export const getStatistikData = async () => {
  try {
    const response = await fetch(createApiUrl('/api/statistik'));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching statistik data:", error);
    throw error;
  }
};
