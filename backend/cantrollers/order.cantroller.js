const orderController = {
  // Create new order
  async create(req, res) {
    try {
      const { buyerId, items, paymentMode, shippingAddress } = req.body;
      
      // Calculate totals
      let subtotal = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }
        
        const itemTotal = product.priceRetail * item.quantity;
        subtotal += itemTotal;
        
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.priceRetail,
          total: itemTotal
        });
      }
      
      const shippingCharges = await shippingService.calculateCharges(
        shippingAddress, 
        orderItems
      );
      
      const order = new Order({
        buyerId,
        items: orderItems,
        subtotal,
        shippingCharges,
        total: subtotal + shippingCharges,
        paymentMode,
        shippingAddress,
        status: 'placed',
        placedAt: new Date()
      });
      
      await order.save();
      
      // Update product stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
      
      // Notify artisans
      await notificationService.notifyNewOrder(order);
      
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get order details
  async getById(req, res) {
    try {
      const { orderId } = req.params;
      
      const order = await Order.findById(orderId)
        .populate('items.productId')
        .populate('buyerId', 'name phone email');
      
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update order status
  async updateStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status, trackingId, courierName } = req.body;
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      
      order.status = status;
      if (trackingId) order.courier.trackingId = trackingId;
      if (courierName) order.courier.name = courierName;
      
      // Add status timeline entry
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: req.body.note || ''
      });
      
      await order.save();
      
      // Notify buyer of status update
      await notificationService.notifyOrderUpdate(order);
      
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get orders by artisan
  async getByArtisan(req, res) {
    try {
      const { artisanId } = req.params;
      const { status, limit = 20, offset = 0 } = req.query;
      
      // Find products by artisan
      const products = await Product.find({ artisanId }).select('_id');
      const productIds = products.map(p => p._id);
      
      let query = { 'items.productId': { $in: productIds } };
      if (status) query.status = status;
      
      const orders = await Order.find(query)
        .populate('items.productId')
        .populate('buyerId', 'name phone')
        .sort({ placedAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit));
      
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};