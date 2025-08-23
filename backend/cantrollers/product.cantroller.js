const productController = {
  // Create new product
  async create(req, res) {
    try {
      const { artisanId } = req.params;
      const productData = req.body;
      
      const product = new Product({
        ...productData,
        artisanId,
        status: 'draft',
        createdAt: new Date()
      });
      
      await product.save();
      
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get products by artisan
  async getByArtisan(req, res) {
    try {
      const { artisanId } = req.params;
      const { status, category } = req.query;
      
      const filter = { artisanId };
      if (status) filter.status = status;
      if (category) filter.category = category;
      
      const products = await Product.find(filter)
        .populate('artisanId', 'name cluster ratings')
        .sort({ createdAt: -1 });
      
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update product
  async update(req, res) {
    try {
      const { productId } = req.params;
      const updates = req.body;
      
      const product = await Product.findByIdAndUpdate(
        productId, 
        updates, 
        { new: true }
      );
      
      // Sync across channels if product is active
      if (product.status === 'active') {
        await distributionService.syncProduct(product);
      }
      
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Publish product
  async publish(req, res) {
    try {
      const { productId } = req.params;
      const { channels } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      // Update product status
      product.status = 'active';
      product.publishedChannels = channels || ['whatsapp', 'microstore'];
      await product.save();
      
      // Distribute across selected channels
      const distributionResults = await distributionService.publishToChannels(
        product, 
        channels
      );
      
      res.json({
        success: true,
        data: { product, distributionResults }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Search products
  async search(req, res) {
    try {
      const { q, category, cluster, priceRange, sortBy } = req.query;
      
      let query = { status: 'active' };
      
      if (q) {
        query.$text = { $search: q };
      }
      if (category) query.category = category;
      if (cluster) {
        const artisans = await Artisan.find({ cluster }).select('_id');
        query.artisanId = { $in: artisans.map(a => a._id) };
      }
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        query.priceRetail = { $gte: min, $lte: max };
      }
      
      let sort = { createdAt: -1 };
      if (sortBy === 'price_low') sort = { priceRetail: 1 };
      if (sortBy === 'price_high') sort = { priceRetail: -1 };
      if (sortBy === 'rating') sort = { 'ratings.average': -1 };
      
      const products = await Product.find(query)
        .populate('artisanId', 'name cluster story ratings')
        .sort(sort)
        .limit(50);
      
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};