import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import affirmationRoutes from './routes/affirmations.js';
import categoryRoutes from './routes/categories.js';
import authorRoutes from './routes/authors.js';
import subscriberRoutes from './routes/subscribers.js';
import uploadRoutes from './routes/upload.js';
import webhookRoutes from './routes/webhook.js';
import { migrate } from './db/migrate.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. CMS login and registration will fail with a 500 error until it is configured.');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/affirmations', affirmationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/subscribe', subscriberRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run migrations on startup
migrate().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Migration failed, server not starting:', error);
  process.exit(1);
});
