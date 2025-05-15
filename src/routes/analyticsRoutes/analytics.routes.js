const express = require('express');
const router = express.Router();
const { AnalyticsController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');

// Summary of all case studies
router.get('/summary', auth, AnalyticsController.getPortfolioSummary);

// Stats per case study (views/clicks by date)
router.get('/:id', auth, AnalyticsController.getCaseStudyAnalytics);

module.exports = router;
