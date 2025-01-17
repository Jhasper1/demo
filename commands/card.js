const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Customer service bot responding to queries based on a knowledge base.',
  usage: 'help [query]',
  author: 'your_name',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ').toLowerCase(); // Combine arguments to form a single query
    try {
      // Load the knowledge base JSON file
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'knowledgeBase.json'), 'utf-8'));

      // Find the relevant answer based on the query
      const response = data[query]; // Access the answer from the knowledge base
      if (response) {
        sendMessage(senderId, { text: response }, pageAccessToken); // Send the response to the user
      } else {
        sendMessage(senderId, { text: 'Sorry, I could not find an answer for your question.' }, pageAccessToken); // Default response
      }
    } catch (err) {
      sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken); // Error response
    }
  }
};
