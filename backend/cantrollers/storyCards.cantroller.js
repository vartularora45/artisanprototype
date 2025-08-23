const storyController = {
  // Generate story card from voice note
  async generateStoryCard(req, res) {
    try {
      const { artisanId } = req.params;
      const voiceFile = req.files.voice;
      const images = req.files.images || [];
      
      // Convert voice to text
      const transcription = await aiService.speechToText(voiceFile);
      
      // Generate story content
      const storyContent = await aiService.generateStory({
        transcription,
        images,
        artisanId
      });
      
      // Create video reel
      const reelData = await videoService.createReel({
        images,
        storyContent,
        voiceFile,
        aspectRatio: '9:16'
      });
      
      const storyCard = new StoryCard({
        artisanId,
        content: storyContent,
        images,
        voiceNote: voiceFile.path,
        reel: reelData,
        languages: storyContent.languages,
        createdAt: new Date()
      });
      
      await storyCard.save();
      
      res.json({ success: true, data: storyCard });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get story cards by artisan
  async getByArtisan(req, res) {
    try {
      const { artisanId } = req.params;
      
      const storyCards = await StoryCard.find({ artisanId })
        .sort({ createdAt: -1 })
        .limit(10);
      
      res.json({ success: true, data: storyCards });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};