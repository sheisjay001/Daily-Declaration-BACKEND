import express from 'express';

const router = express.Router();

// Webhook endpoint for Serlo integration
// Serlo will call this endpoint to receive subscription data
// or this endpoint can forward subscription data to Serlo
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get Serlo webhook URL from environment variables
    const serloWebhookUrl = process.env.SERLO_WEBHOOK_URL;

    if (serloWebhookUrl) {
      // Forward the subscription to Serlo
      try {
        await fetch(serloWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        console.error('Failed to forward to Serlo:', error);
        // Continue anyway - we'll save locally
      }
    }

    // Optionally save to local database (if you want backup)
    // This would require adding a subscribers table if not already present

    res.status(200).json({ 
      success: true, 
      message: 'Subscription processed',
      email 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check for webhook
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'webhook' });
});

export default router;
