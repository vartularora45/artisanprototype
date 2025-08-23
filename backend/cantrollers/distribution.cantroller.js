const distributionController = {
  // Sync product to multiple channels
  async syncProduct(req, res) {
    try {
      const { productId } = req.params;
      const { channels } = req.body;
      
      const product = await Product.findById(productId).populate('artisanId');
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      const results = {};
      
      for (const channel of channels) {
        try {
          switch (channel) {
            case 'whatsapp':
              results.whatsapp = await whatsappService.createCatalogItem(product);
              break;
            case 'instagram':
              results.instagram = await instagramService.createProduct(product);
              break;
            case 'facebook':
              results.facebook = await facebookService.createProduct(product);
              break;
            case 'microstore':
              results.microstore = await microstoreService.publishProduct(product);
              break;
            case 'etsy':
              results.etsy = await etsyService.createListing(product);
              break;
          }
        } catch (channelError) {
          results[channel] = { error: channelError.message };
        }
      }
      
      // Update product with channel sync status
      await Product.findByIdAndUpdate(productId, {
        publishedChannels: channels,
        channelSyncStatus: results,
        lastSyncAt: new Date()
      });
      
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Generate WhatsApp catalog
  async generateWhatsAppCatalog(req, res) {
    try {
      const { artisanId } = req.params;
      
      const products = await Product.find({ 
        artisanId, 
        status: 'active' 
      }).select('title images priceRetail description');
      
      const catalogData = await whatsappService.generateCatalog(products, artisanId);
      
      res.json({ success: true, data: catalogData });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Create microstore
  async createMicrostore(req, res) {
    try {
      const { artisanId } = req.params;
      
      const artisan = await Artisan.findById(artisanId);
      const products = await Product.find({ artisanId, status: 'active' });
      
      const microstoreData = {
        artisan,
        products,
        theme: req.body.theme || 'default',
        customization: req.body.customization || {}
      };
      
      const microstore = await microstoreService.create(microstoreData);
      
      res.json({ success: true, data: microstore });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};