const kycController = {
  // Submit KYC documents
  async submitKYC(req, res) {
    try {
      const { artisanId } = req.params;
      const documents = req.files;
      
      const kycSubmission = await kycService.submitDocuments(artisanId, documents);
      
      res.json({ success: true, data: kycSubmission });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Verify artisan
  async verifyArtisan(req, res) {
    try {
      const { artisanId } = req.params;
      const { status, notes } = req.body;
      
      const verification = await kycService.verifyArtisan(artisanId, status, notes);
      
      res.json({ success: true, data: verification });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};