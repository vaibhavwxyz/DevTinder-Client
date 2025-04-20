# DevTinder Frontend

This is the frontend for the DevTinder project, a platform for developers to connect based on skills and interests.

## Tech Stack

- React + TypeScript (Vite)
- Redux Toolkit + RTK Query for state management and API calls
- Tailwind CSS for styling
- ShadCN components

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/api` - RTK Query API slices
- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/store` - Redux store configuration
- `/src/hooks` - Custom hooks
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions

## API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication

- POST /login - User login
- POST /register - User registration
- POST /logout - User logout

### Profile

- GET /profile/view - View user profile
- PATCH /profile/edit - Edit user profile
- PATCH /profile/password - Update password

### Connections

- GET /user/connections - Get user connections
- GET /user/requests - Get connection requests
- GET /user/feed - Get profiles feed
- POST /request/send/:status/:userId - Send connection request
- POST /request/review/:status/:requestId - Review connection request

Status options: ignored, interested, accepted, rejected
