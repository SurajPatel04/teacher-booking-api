# EnglishYari Backend Assignment

A RESTful API application built for booking sessions between users and teachers.

## Tech Stack
- **Node.js & Express.js**
- **TypeScript**
- **MongoDB & Mongoose**
- **Zod** (for strict request validation)

## Architecture & Clean Code
This project strictly follows a **Controller-Service-Model** architecture:
- **Controllers** handle HTTP-specific logic (requests, responses, status codes).
- **Services** house the business logic and database interactions. Complex requirements like API 3 and API 6 use advanced **MongoDB Aggregation Pipelines** (`$lookup`, `$facet`, etc.) to process data efficiently on the database level.
- **Middlewares** handle cross-cutting concerns like Zod schema validation and global error handling (`ApiError`).

## Assumptions & Enhancements
- **No Overlapping Sessions:** As an enhancement beyond the explicit requirements, a robust database check was implemented to prevent teachers from creating overlapping sessions (avoiding double-bookings).

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory (reference `.env.example`):
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/englishyari
   NODE_ENV=development
   ```

3. **Database**:
   Ensure you have a MongoDB instance running locally (or provide an Atlas URI in your `.env`).

4. **Run the server**:
   Start the development server using `tsx` for hot-reloading native ESM:
   ```bash
   npm run dev
   ```
   *The server will start on http://localhost:8000*

## API Testing (Postman)
A Postman collection is included in the `Postman` directory: `Postman/Teacher Booking API.postman_collection.json`.
1. Open Postman.
2. Click **Import** and select the `.json` file.
3. Test the endpoints sequentially!

### Available Endpoints
- `POST /api/v1/users` - Create User
- `POST /api/v1/teachers` - Create Teacher
- `POST /api/v1/sessions` - Create Session
- `GET /api/v1/sessions/available?dateTimestamp={timestamp}` - Available Sessions (Aggregation)
- `POST /api/v1/sessions/:id/book` - Book Session
- `PATCH /api/v1/sessions/:id/complete` - Mark Session Complete
- `GET /api/v1/users/:id/sessions` - User Session List (Aggregation)
