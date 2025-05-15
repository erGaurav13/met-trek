const { AnalyticsModel } = require('../../model/index.model');

class AnalyticsService {
  async getPortfolioSummary(userId, timeRange = '7d') {
    const dateFilter = this._getDateFilter(timeRange);
    
    return AnalyticsModel.aggregate([
      { 
        $match: { 
          userId,
          timestamp: { $gte: dateFilter } 
        } 
      },
      {
        $group: {
          _id: {
            caseStudyId: "$caseStudyId",
            event: "$event"
          },
          count: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorIP" }
        }
      },
      {
        $group: {
          _id: "$_id.caseStudyId",
          events: {
            $push: {
              event: "$_id.event",
              count: "$count"
            }
          },
          totalViews: {
            $sum: {
              $cond: [{ $eq: ["$_id.event", "view"] }, "$count", 0]
            }
          },
          totalClicks: {
            $sum: {
              $cond: [{ $eq: ["$_id.event", "click"] }, "$count", 0]
            }
          },
          uniqueVisitors: { $sum: { $size: "$uniqueVisitors" } }
        }
      },
      {
        $project: {
          caseStudyId: "$_id",
          events: 1,
          totalViews: 1,
          totalClicks: 1,
          uniqueVisitors: 1,
          engagementRate: {
            $cond: [
              { $eq: ["$totalViews", 0] },
              0,
              { $divide: ["$totalClicks", "$totalViews"] }
            ]
          }
        }
      }
    ]);
  }

  async getCaseStudyAnalytics(caseStudyId, timeRange = '7d') {
    const dateFilter = this._getDateFilter(timeRange);
    
    return AnalyticsModel.aggregate([
      { 
        $match: { 
          caseStudyId,
          timestamp: { $gte: dateFilter } 
        } 
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            event: "$event"
          },
          count: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorIP" }
        }
      },
      {
        $group: {
          _id: "$_id.date",
          events: {
            $push: {
              event: "$_id.event",
              count: "$count"
            }
          },
          dailyViews: {
            $sum: {
              $cond: [{ $eq: ["$_id.event", "view"] }, "$count", 0]
            }
          },
          dailyClicks: {
            $sum: {
              $cond: [{ $eq: ["$_id.event", "click"] }, "$count", 0]
            }
          },
          uniqueVisitors: { $sum: { $size: "$uniqueVisitors" } }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          date: "$_id",
          events: 1,
          dailyViews: 1,
          dailyClicks: 1,
          uniqueVisitors: 1,
          engagementRate: {
            $cond: [
              { $eq: ["$dailyViews", 0] },
              0,
              { $divide: ["$dailyClicks", "$dailyViews"] }
            ]
          }
        }
      }
    ]);
  }

  _getDateFilter(timeRange) {
    const now = new Date();
    switch(timeRange) {
      case '24h': return new Date(now.setDate(now.getDate() - 1));
      case '7d': return new Date(now.setDate(now.getDate() - 7));
      case '30d': return new Date(now.setDate(now.getDate() - 30));
      case '90d': return new Date(now.setDate(now.getDate() - 90));
      default: return new Date(0); // All time
    }
  }
}

module.exports = new AnalyticsService();