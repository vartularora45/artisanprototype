const analyticsController = {
  // Get artisan dashboard analytics
  async getArtisanAnalytics(req, res) {
    try {
      const { artisanId } = req.params;
      const { period = '30d' } = req.query;
      
      const analytics = await analyticsService.getArtisanInsights(artisanId, period);
      
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get product performance
  async getProductAnalytics(req, res) {
    try {
      const { productId } = req.params;
      const { period = '30d' } = req.query;
      
      const analytics = await analyticsService.getProductInsights(productId, period);
      
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get channel performance
  async getChannelAnalytics(req, res) {
    try {
      const { artisanId } = req.params;
      
      const channelPerformance = await analyticsService.getChannelPerformance(artisanId);
      
      res.json({ success: true, data: channelPerformance });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};