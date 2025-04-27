const axios = require('axios');

/**
 * Generate questions using OpenAI (GPT-3.5-turbo)
 * @param {string} prompt
 * @param {string} apiKey
 * @returns {Promise<string>} AI response
 */
async function generateWithOpenAI(prompt, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const data = {
    model: 'gpt-3.5-turbo',
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

module.exports = { generateWithOpenAI };
