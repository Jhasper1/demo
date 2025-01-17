const axios = require('axios');
const cheerio = require('cheerio');  // To parse HTML
const { sendMessage } = require('../handles/sendMessage');
const { v4: uuidv4 } = require('uuid');


module.exports = {
  name: 'info',
  description: 'Fetch information from a specific website',
  usage: 'info [query]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const query = args.join(' ');  // Combine the args to form the query
    const url = `https://cardbankph.com/search?q=${encodeURIComponent(query)}`;
  // Your custom URL here

    try {
      // Fetch the HTML content of the page
      const { data } = await axios.get(url);
      
      // Parse the HTML content using Cheerio
      const $ = cheerio.load(data);
      
      // Extract the relevant content based on the structure of the webpage
      // This depends on how the website is structured; let's assume we want the first paragraph with class 'content'
      const answer = $('p.content').text();  // Example: replace 'p.content' with the appropriate selector

      if (answer) {
        // If an answer is found, send it back to the user
        sendMessage(senderId, { text: answer }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Sorry, I could not find an answer on the website.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'Sorry, there was an error fetching the information.' }, pageAccessToken);
    }
  }
};
