// Minimal stub for /api/results to prevent backend crash
const express = require('express');
const router = express.Router();

// GET /api/results/test
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Results route stub working.' });
});

module.exports = router;
