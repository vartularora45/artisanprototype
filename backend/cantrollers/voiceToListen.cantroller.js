const voiceToListingController = {
  // Process voice note to create product listing
  async processVoiceNote(req, res) {
    try {
      const { artisanId } = req.params;
      const voiceFile = req.files.voice;
      const images = req.files.images || [];
      const { materialCost, timeSpent } = req.body;

      // Step 1: Speech-to-text conversion
      const transcription = await aiService.speechToText(voiceFile, 'hindi');
      
      // Step 2: Image analysis
      const imageAnalysis = await Promise.all(
        images.map(img => aiService.analyzeImage(img))
      );
      
      // Step 3: Generate structured listing
      const listingData = await aiService.generateListing({
        transcription,
        imageAnalysis,
        materialCost,
        timeSpent
      });
      
      // Step 4: Multi-language translation
      const translations = await aiService.translateListing(
        listingData, 
        ['english', 'hindi', 'gujarati', 'bengali']
      );
      
      // Step 5: Generate pricing suggestions
      const pricingSuggestions = await pricingService.calculatePricing({
        materialCost,
        timeSpent,
        complexity: listingData.complexity,
        category: listingData.category
      });
      
      res.json({
        success: true,
        data: {
          listing: listingData,
          translations,
          pricing: pricingSuggestions,
          confidence: listingData.confidence
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Refine AI-generated listing
  async refineListing(req, res) {
    try {
      const { listingId } = req.params;
      const { corrections, feedback } = req.body;
      
      const refinedListing = await aiService.refineListing(listingId, {
        corrections,
        feedback
      });
      
      res.json({ success: true, data: refinedListing });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};