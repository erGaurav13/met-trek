const analyticsService = require('./analytics.service');

class AnalyticsController {
  async getPortfolioSummary(req, res) {
    try {
      const userId = req.user._id;
      const { range = '7d' } = req.query;
      
      const summary = await analyticsService.getPortfolioSummary(userId, range);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCaseStudyAnalytics(req, res) {
    try {
      const caseStudyId = req.params.id;
      const { range = '7d' } = req.query;
      
      const stats = await analyticsService.getCaseStudyAnalytics(caseStudyId, range);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AnalyticsController();