const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'customer_service',
  description: 'Customer service representative for answering queries',
  usage: 'customer_service [question]',
  author: 'Your Name',

  async execute(senderId, args, pageAccessToken) {
    // Combine args into a single query string
    const query = args.join(' ').toLowerCase();

    try {
      // Read the knowledge base file
      const knowledgeBasePath = path.join(__dirname, 'knowledgeBase.json');
      const data = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));

      // Log the knowledge base data (for debugging purposes)
      console.log('Knowledge Base:', data);

      // Find the response in the knowledge base based on the query
      const response = data[query];

      if (response) {
        // Send the response from the knowledge base
        sendMessage(senderId, { text: response }, pageAccessToken);
      } else {
        // If no match, send a default response
        sendMessage(senderId, { text: 'Sorry, I could not find an answer for your question.' }, pageAccessToken);
      }
    } catch (err) {
      console.error('Error:', err);
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
