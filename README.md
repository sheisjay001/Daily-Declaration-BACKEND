# Daily Declarations Backend

Backend API for the Daily Declarations website - a daily affirmations blog for sisters.

## Tech Stack
- Express
- TypeScript
- PostgreSQL (Neon)
- JWT Authentication
- Multer (image uploads)

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://...

# Run migrations
npm run migrate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

**Development:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Set to `development`

**Production:**
- `DATABASE_URL` - PostgreSQL connection string (from Neon/Render)
- `JWT_SECRET` - Secret for JWT signing (generate a random string)
- `PORT` - Server port (default: 10000 on Render)
- `NODE_ENV` - Set to `production`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Affirmations
- `GET /api/affirmations` - Get all affirmations (with filtering, pagination)
- `GET /api/affirmations/:slug` - Get single affirmation
- `POST /api/affirmations` - Create affirmation (auth required)
- `PUT /api/affirmations/:id` - Update affirmation (auth required)
- `DELETE /api/affirmations/:id` - Delete affirmation (auth required)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get single author

### Subscribers
- `POST /api/subscribe` - Subscribe to email list

### Upload
- `POST /api/upload` - Upload image (auth required)

## Deployment

Deploy as a Node.js service on Render:
1. Push code to GitHub
2. Create new web service on Render
3. Runtime: Node
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add environment variables (DATABASE_URL, JWT_SECRET, PORT, NODE_ENV)

## Database Schema

- `users` - CMS authentication
- `affirmations` - Affirmation content
- `categories` - Affirmation categories
- `authors` - Content authors
- `subscribers` - Email subscribers
