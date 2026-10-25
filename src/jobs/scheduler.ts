import pool from '../db/index.js';

// Check for scheduled posts and publish them
export async function checkScheduledPosts() {
  try {
    const now = new Date();
    
    const result = await pool.query(
      `UPDATE affirmations 
       SET is_published = true, scheduled_at = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE scheduled_at IS NOT NULL 
       AND scheduled_at <= $1
       AND is_published = false
       RETURNING *`,
      [now]
    );
    
    if (result.rows.length > 0) {
      console.log(`Published ${result.rows.length} scheduled posts:`, 
        result.rows.map(r => r.title).join(', ')
      );
    }
    
    return result.rows;
  } catch (error) {
    console.error('Error checking scheduled posts:', error);
  }
}

// Start the scheduler (runs every minute)
export function startScheduler() {
  console.log('Starting post scheduler...');
  
  // Run immediately on startup
  checkScheduledPosts();
  
  // Then run every minute
  setInterval(() => {
    checkScheduledPosts();
  }, 60000); // 60 seconds
}
