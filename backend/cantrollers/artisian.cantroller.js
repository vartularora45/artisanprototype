const artisanController = {
  // Register new artisan
  async register(req, res) {
    try {
      const { name, phone, cluster, languages, kycDocuments } = req.body;
      
      // Create artisan profile
      const artisan = new Artisan({
        name,
        phone,
        cluster,
        languages: languages || ['hindi', 'english'],
        kycStatus: 'pending',
        story: '',
        contacts: { phone, whatsapp: phone },
        ratings: { average: 0, count: 0 }
      });
      
      await artisan.save();
      
      // Trigger KYC verification if documents provided
      if (kycDocuments) {
        await kycService.initiateVerification(artisan._id, kycDocuments);
      }
      
      res.status(201).json({
        success: true,
        data: artisan,
        message: 'Artisan registered successfully'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get artisan profile
  async getProfile(req, res) {
    try {
      const { artisanId } = req.params;
      const artisan = await Artisan.findById(artisanId).populate('products');
      
      if (!artisan) {
        return res.status(404).json({ success: false, error: 'Artisan not found' });
      }
      
      res.json({ success: true, data: artisan });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update artisan profile
  async updateProfile(req, res) {
    try {
      const { artisanId } = req.params;
      const updates = req.body;
      
      const artisan = await Artisan.findByIdAndUpdate(
        artisanId, 
        updates, 
        { new: true, runValidators: true }
      );
      
      res.json({ success: true, data: artisan });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get artisans by cluster
  async getByCluster(req, res) {
    try {
      const { cluster } = req.params;
      const artisans = await Artisan.find({ cluster, kycStatus: 'verified' })
        .select('-__v')
        .sort({ 'ratings.average': -1 });
      
      res.json({ success: true, data: artisans });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};