const axios = require('axios');
require('dotenv').config();
const { generateWithOpenAI } = require('./openaiHelper');
const { generateWithOpenRouter } = require('./openrouterHelper');

// POST /api/ai/generate
// Body: { prompt, subject, category, difficulty, numQuestions, openaiApiKey, openrouterApiKey, openrouterModel, extraHeaders }
exports.generateAIQuestions = async (req, res) => {
  try {
    const { prompt, subject, category, difficulty, numQuestions } = req.body;
    const openrouterApiKey = req.body.openrouterApiKey || process.env.OPENROUTER_API_KEY;
    const openrouterModel = req.body.openrouterModel || 'meta-llama/llama-4-maverick:free';
    const extraHeaders = req.body.extraHeaders || {};
    const systemPrompt = prompt || `Generate ${numQuestions||5} multiple choice questions for subject: ${subject}, category: ${category}, difficulty: ${difficulty}. Return JSON array with {text, options, correctOption}.`;

    if (openrouterApiKey) {
      // Use OpenRouter (Llama 4 Maverick)
      try {
        const aiText = await generateWithOpenRouter(systemPrompt, openrouterApiKey, openrouterModel, extraHeaders);
        let questions = [];
        try {
          questions = JSON.parse(aiText);
        } catch (e) {
          // Try to extract JSON array from text
          const match = aiText.match(/\[.*\]/s);
          if (match) {
            questions = JSON.parse(match[0]);
          } else {
            throw new Error('Could not parse OpenRouter response as questions JSON.');
          }
        }
        return res.json({ success: true, data: questions });
      } catch (error) {
        console.error('OpenRouter question generation error:', error?.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'OpenRouter question generation failed', error: error?.response?.data || error.message });
      }
    }

    // Check if OpenAI API key is set (env or request)
    const openaiApiKey = req.body.openaiApiKey || process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      // Use OpenAI
      try {
        const aiText = await generateWithOpenAI(systemPrompt, openaiApiKey);
        let questions = [];
        try {
          questions = JSON.parse(aiText);
        } catch (e) {
          // Try to extract JSON array from text
          const match = aiText.match(/\[.*\]/s);
          if (match) {
            questions = JSON.parse(match[0]);
          } else {
            throw new Error('Could not parse OpenAI response as questions JSON.');
          }
        }
        return res.json({ success: true, data: questions });
      } catch (error) {
        console.error('OpenAI question generation error:', error?.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'OpenAI question generation failed', error: error?.response?.data || error.message });
      }
    }

    // Fallback to Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'No AI API key set in backend.' });
    }
    // Prepare Gemini API request
    // Use the latest stable Gemini model and v1 endpoint
    const model = 'gemini-1.5-pro'; // or 'gemini-2.0-flash' for a lighter model
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    const geminiReq = {
      contents: [{ parts: [{ text: systemPrompt }] }]
    };
    const geminiRes = await axios.post(geminiUrl, geminiReq);
    // Try to parse response
    let questions = [];
    const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    try {
      questions = JSON.parse(text);
    } catch (e) {
      // fallback: try to extract JSON from text
      const match = text.match(/\[.*\]/s);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse Gemini response as questions JSON.');
      }
    }
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('AI question generation error:', error?.response?.data || error.message);
    res.status(500).json({ success: false, message: 'AI question generation failed', error: error?.response?.data || error.message });
  }
};
