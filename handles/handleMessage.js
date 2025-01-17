const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const prefix = '-'; // Command prefix

// Load command modules
fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('Invalid event object');

  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('Received event without message text');

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');

  try {
    if (commands.has(commandName.toLowerCase())) {
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage); // Execute the command
    } else {
      // If the command doesn't exist, fallback to a default action
      await sendMessage(senderId, { text: 'Sorry, I did not understand your request.' }, pageAccessToken); // Default response
    }
  } catch (error) {
    console.error('Error executing command:', error);
    await sendMessage(senderId, { text: error.message || 'There was an error processing your request.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };
