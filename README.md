# Study Hub 
A RESTful backend API for a student academic resource-sharing platform. Students can browse courses and access study materials (lecture notes, sheets, labs, assignments, previous exams, summaries, tutorials, and reference links), while admins manage courses and upload resources.

## Features

- **Authentication & Authorization** — JWT-based auth with role-based access control (`student` / `admin`)
- **User Management** — registration, login, profile view/update, admin-only user deletion
- **Course Management** — full CRUD on courses (name, code, academic level, semester, description)
- **Resource Management** — full CRUD on study resources with:
    - Type-aware validation (e.g. tutorials must be YouTube, references must be external links, sheets/labs/assignments must be PDFs)
    - PDF upload to Cloudinary, or YouTube/external link sources
    - Search (title/description), filtering (course, level, semester, type, source type), sorting, and pagination
    - Download count tracking
- **Centralized error handling** and request logging middleware

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js / Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Validation | Zod |
| File Storage | Cloudinary + Multer |
| Config | dotenv |


## Project Structure

```
src/
├── app.js                  # Express app configuration
├── controllers/            # Route handlers (auth, users, courses, resources)
├── models/                 # Mongoose schemas (User, Course, Resource)
├── routes/                 # Express routers
├── middlewares/            # auth, authorize, validator, logger, error/404 handlers, uploads
├── validators/              # Zod schemas for auth, courses, resources, user profile
├── services/                # dbConfig, cloudinary, userService
└── utils/                   # responseHandler, queryHelpers, stringHelpers, fileHelper
server.js                    # Entry point — loads env, connects DB, starts server
```


### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

MONGODB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
## API Requests


### Auth (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Log in and receive a JWT | Public |

### Users (`/api/users`) — requires authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/profile` | Get current user's profile | Authenticated |
| PUT | `/profile` | Update current user's profile | Authenticated |
| DELETE | `/:id` | Delete a user | Admin |

### Courses (`/api/courses`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List all courses | Public |
| GET | `/:courseCode` | Get a course by code | Public |
| POST | `/` | Create a course | Admin |
| PUT | `/:courseCode` | Update a course | Admin |
| DELETE | `/:courseCode` | Delete a course | Admin |

### Resources (`/api/resources`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List/search/filter/sort/paginate resources | Public |
| GET | `/:id` | Get a single resource | Public |
| POST | `/` | Create a resource (optional PDF upload) | Admin |
| PUT | `/:id` | Update a resource | Admin |
| DELETE | `/:id` | Delete a resource | Authenticated |


**Query params for `GET /api/resources`:** `search`, `course`, `level`, `semester`, `type`, `sourceType`, `sort`, `page`, `limit`

**Resource types:** `lecture`, `sheet`, `lab`, `assignment`, `previous_exam`, `summary`, `tutorial`, `reference`

**Source types:** `pdf`, `youtube`, `link`


## Data Models

**User** — `name`, `email`, `password`, `university`, `department`, `academicLevel`, `role` (`student`/`admin`), `profileInformation.{bio, avatar}`

**Course** — `courseName`, `courseCode`, `academicLevel`, `semester`, `description`

**Resource** — `title`, `description`, `type`, `sourceType`, `fileUrl`, `cloudinaryPublicId`, `externalUrl`, `course` (ref), `uploadedBy` (ref), `downloadCount`

## Response Format

All responses follow a consistent shape:

```json
{
  "success": true,
  "message": "Description of the result",
  "statusCode": 200,
  "data": {}
}
``` 