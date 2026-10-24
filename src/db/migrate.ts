import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await pool.connect();
    
    console.log('Reading schema file...');
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    
    console.log('Running migrations...');
    await pool.query(schema);
    
    console.log('Migration completed successfully!');
    
    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name, slug) 
      VALUES 
        ('Self-Love', 'self-love'),
        ('Confidence', 'confidence'),
        ('Gratitude', 'gratitude'),
        ('Abundance', 'abundance'),
        ('Peace', 'peace'),
        ('Growth', 'growth')
      ON CONFLICT (slug) DO NOTHING
    `);
    
    console.log('Default categories inserted!');
    
    // Insert default author
    await pool.query(`
      INSERT INTO authors (name, role, bio) 
      VALUES ('Daily Declarations Team', 'Editor', 'Bringing positive affirmations to your daily life.')
      ON CONFLICT DO NOTHING
    `);
    
    console.log('Default author inserted!');
    
    // Insert default admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (email, password_hash) 
      VALUES ('admin@dailydeclarations.com', $1)
      ON CONFLICT (email) DO NOTHING
    `, [passwordHash]);
    
    console.log('Default admin user inserted! Email: admin@dailydeclarations.com, Password: admin123');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Only run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}

export { migrate };
