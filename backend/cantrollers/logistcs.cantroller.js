const logisticsController = {
  // Calculate shipping rates
  async calculateShipping(req, res) {
    try {
      const { fromPincode, toPincode, weight, dimensions } = req.body;
      
      const rates = await logisticsService.getShippingRates({
        fromPincode,
        toPincode,
        weight,
        dimensions
      });
      
      res.json({ success: true, data: rates });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Schedule pickup
  async schedulePickup(req, res) {
    try {
      const { orderId } = req.params;
      const { pickupDate, timeSlot, courierPartner } = req.body;
      
      const pickup = await logisticsService.schedulePickup({
        orderId,
        pickupDate,
        timeSlot,
        courierPartner
      });
      
      res.json({ success: true, data: pickup });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Track shipment
  async trackShipment(req, res) {
    try {
      const { trackingId } = req.params;
      
      const tracking = await logisticsService.trackShipment(trackingId);
      
      res.json({ success: true, data: tracking });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};