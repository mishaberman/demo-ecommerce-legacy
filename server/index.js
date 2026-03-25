const express = require('express');
const crypto = require('crypto');
const fetch = require('node-fetch'); // or use axios

const app = express();
app.use(express.json());

const META_PIXEL_ID = 'YOUR_PIXEL_ID';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN; // Store securely in environment variables

app.post('/api/purchase', async (req, res) => {
  const { cart, user, event_id } = req.body;

  const eventData = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: 'https://your-domain.com/checkout',
    event_id: event_id, // Must be unique for deduplication
    action_source: 'website',
    user_data: {
      em: [crypto.createHash('sha256').update(user.email).digest('hex')],
      fn: [crypto.createHash('sha256').update(user.firstName).digest('hex')],
      ln: [crypto.createHash('sha256').update(user.lastName).digest('hex')],
      client_ip_address: req.ip,
      client_user_agent: req.headers['user-agent'],
      fbc: req.cookies._fbc || null, // Get from cookie
      fbp: req.cookies._fbp || null, // Get from cookie
    },
    custom_data: {
      value: cart.total,
      currency: 'USD',
      content_ids: cart.items.map(item => item.productId),
      content_type: 'product',
      num_items: cart.items.length,
    },
  };

  const payload = {
    data: [eventData],
    // test_event_code: 'YOUR_TEST_CODE' // Optional: for testing in Events Manager
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log('CAPI Response:', result);
    res.status(200).send(result);
  } catch (error) {
    console.error('CAPI Error:', error);
    res.status(500).send('Error sending CAPI event');
  }
});

// Add other routes and start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
