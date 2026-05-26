# Environment Configuration Guide

This project uses environment variables for configuration. Follow these steps to set up your local development environment.

## Quick Start

1. **Copy the example file:**

   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file with your API keys** (see sections below)

3. **Run development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend Configuration

- `BACKEND_PORT`: Port for the backend API server (default: 5050)
- `FRONTEND_ORIGIN`: CORS origin for frontend (default: http://localhost:3000)

```env
BACKEND_PORT=5050
FRONTEND_ORIGIN=http://localhost:3000
```

### YouTube API Configuration

To enable YouTube functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Create an API Key:
   - Click "Credentials" in the left sidebar
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. Add to `.env`:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key_here
   YOUTUBE_CHANNEL_ID=your_channel_id_here
   REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

**Note:** `YOUTUBE_CHANNEL_ID` is optional. If not provided, the app will still work but won't filter by channel.

### Google Drive API Configuration

To enable Google Drive functionality:

1. In the same Google Cloud project as YouTube API:
2. Enable the **Google Drive API**
3. Create an API Key (or reuse the one from YouTube):
   - Go to Credentials
   - Create Credentials → API Key (if you don't have one)

4. Get your Google Drive Folder ID:
   - Open Google Drive and navigate to your folder
   - The ID is the last part of the URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`

5. Add to `.env`:
   ```env
   GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here
   GOOGLE_DRIVE_ROOT_FOLDER_ID=your_folder_id_here
   REACT_APP_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key_here
   ```

### Frontend API Configuration

- `REACT_APP_API_BASE_URL`: Base URL for API calls
  - Local development: `http://localhost:5050`
  - Production: Your deployed backend URL

```env
REACT_APP_API_BASE_URL=http://localhost:5050
```

## Complete `.env` Example

```env
# Backend Configuration
BACKEND_PORT=5050
FRONTEND_ORIGIN=http://localhost:3000

# YouTube API Configuration
YOUTUBE_API_KEY=AIza...your_key_here
YOUTUBE_CHANNEL_ID=UCa...your_channel_id
REACT_APP_YOUTUBE_API_KEY=AIza...your_key_here

# Google Drive API Configuration
GOOGLE_DRIVE_API_KEY=AIza...your_key_here
GOOGLE_DRIVE_ROOT_FOLDER_ID=1u8W7fIhWNg4Hlh6y165AhWo1NcpuzSEW
REACT_APP_GOOGLE_DRIVE_API_KEY=AIza...your_key_here

# Frontend API Configuration
REACT_APP_API_BASE_URL=http://localhost:5050
```

## Production Deployment

For production deployment, set environment variables in your hosting platform:

### Vercel (Alternative)

1. Go to your project settings
2. Navigate to Environment Variables
3. Add all required variables (without `REACT_APP_` prefix for backend vars)

### Other Platforms (Netlify, Heroku, etc.)

Refer to your platform's documentation for setting environment variables.

**Important:** Never commit `.env` to version control. The `.env` file is gitignored automatically.

## Troubleshooting

### "API Key not configured" errors

- Check that your `.env` file exists in the project root
- Verify you're using the correct environment variable names
- For React variables, ensure they start with `REACT_APP_`
- Restart your development server after changing `.env`

### API calls returning 403 or 401 errors

- Verify your API keys are correct
- Check that the APIs are enabled in Google Cloud Console
- Ensure your API key has the necessary permissions

### CORS errors

- Make sure `FRONTEND_ORIGIN` matches your frontend URL
- For local development, it should be `http://localhost:3000`

## Security Note

- **Never** commit `.env` or `.env.local` to version control
- **Never** share your API keys publicly
- Regenerate API keys if they've been exposed
- Use different API keys for development and production
