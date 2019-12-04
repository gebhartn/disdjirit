// see env, requires discord and google apis
require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const { Client, Collection } = require("discord.js");

// middleware
const {
  validateViableInputs,
  checkCommandOrAliasExists
} = require("./index-middleware");

const client = new Client({
  // disable everyone pings
  disableEveryone: true
});

// initialize commands
client.commands = new Collection();
// initialize aliases
client.aliases = new Collection();

// iterate fs for command/alias tree
["command"].forEach(handler => {
  // command.js exports function
  require(`./handler/${handler}`)(client);
});

// server listen
client.on("ready", () => {
  const { username } = client.user;
  // prints to console along with ascii commands - see handler/command.js
  console.log(`\nNow Playing: ${username}`);
});

// message listen
client.on("message", msg => {
  // middleware isn't working correctly, but users decided it was a fun feature
  const prefix = "::";
  // validation middleware ignores bot to prevent feedback loop
  validateViableInputs(msg, prefix);
  // contains message content as a string minus prefix
  const slicedContent = msg.content.slice(prefix.length).trim();
  // contains message content as an array
  const content = slicedContent.split(/ +/g);
  // contains command -> ex. ::view (content = 'view')
  const cmd = content.shift().toLowerCase();
  // stop listening if command prefix is missing
  if (!cmd.length) return;
  // command -> alias -> plain message
  checkCommandOrAliasExists(client, msg, content, cmd);
});

// action
client.login(`${TOKEN}`);
