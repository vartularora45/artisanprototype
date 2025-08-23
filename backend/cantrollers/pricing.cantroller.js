const pricingController = {
  // Calculate fair pricing
  async calculateFairPrice(req, res) {
    try {
      const { materialCost, timeSpent, complexity, category, region } = req.body;
      
      const pricingData = await pricingService.calculateFairPrice({
        materialCost: Number(materialCost),
        timeSpent: Number(timeSpent),
        complexity: complexity || 'medium',
        category,
        region
      });
      
      res.json({ success: true, data: pricingData });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get pricing insights
  async getPricingInsights(req, res) {
    try {
      const { category, region } = req.query;
      
      const insights = await pricingService.getMarketInsights({
        category,
        region
      });
      
      res.json({ success: true, data: insights });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};