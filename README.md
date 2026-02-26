# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs frontend and backend together in development mode.

- React app: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

### `npm start`

Runs only the React frontend in development mode.

### `npm run server:dev`

Runs only the backend API server with auto-reload.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages.

### Deploy

1. Install dependencies:

```
npm install
```

2. Deploy:

```
npm run deploy
```

The site will be published at:

```
https://abetkalinggaw.github.io/web-kebonarum
```

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Google Drive Gallery Setup (Backend API)

1. In Google Cloud Console:
   - Enable `Google Drive API`
   - Create an API key for backend/server usage
   - Do **not** restrict this key by `HTTP referrers (web sites)`
   - Use `IP addresses` restriction (server IP) or leave unrestricted during local development

2. Copy environment template:

```
cp .env.example .env
```

3. In `.env`, set:

```
GOOGLE_DRIVE_API_KEY=YOUR_GOOGLE_DRIVE_API_KEY
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID=YOUR_YOUTUBE_CHANNEL_ID
FRONTEND_ORIGIN=http://localhost:3000
REACT_APP_API_BASE_URL=
```

4. In Google Drive, set each photo folder to:
   - `Anyone with the link` → `Viewer`

5. Fill each `driveFolderId` in `backend/data/documentationItems.js`
   - Folder URL format:
     `https://drive.google.com/drive/folders/FOLDER_ID`

6. Run both frontend and backend:

```
npm run dev
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
