const axios = require('axios');

/**
 * Generate questions using OpenRouter (Meta Llama 4 Maverick)
 * @param {string} prompt
 * @param {string} apiKey
 * @param {string} model
 * @param {object} [extraHeaders]
 * @returns {Promise<string>} AI response
 */
async function generateWithOpenRouter(prompt, apiKey, model, extraHeaders = {}) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  const data = {
    model: model || 'meta-llama/llama-4-maverick:free',
    messages: [
      { role: 'system', content: 'You are a helpful assistant for generating multiple choice questions.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1024,
    temperature: 0.7,
  };
  const response = await axios.post(url, data, { headers });
  return response.data.choices[0].message.content;
}

module.exports = { generateWithOpenRouter };
