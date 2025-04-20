
# Studio File Pilot

An advanced file management application with modern UI/UX.

## Features

- 📂 File and folder navigation
- 📤 File upload functionality
- 📥 File download capability
- 🗃️ File organization and sorting
- 🔍 List and grid views
- 🗑️ Delete operations
- 📁 Create new folders

## Running the Application

The application is built to run on port 8080 by default.

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080

## Project Structure

- `src/components/FileManager/`: UI components for the file manager
- `src/hooks/useFileManager.tsx`: Core file management logic
- `src/types/`: TypeScript definitions
- `src/utils/`: Utility functions

## Deployment

This application is designed to be easy to deploy. You can use services like Vercel, Netlify, or traditional hosting:

```sh
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Base Directory Configuration

The file manager is configured to use `/teamspace/studios/this_studio` as the base directory.
