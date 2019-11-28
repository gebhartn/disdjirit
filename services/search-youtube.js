const YouTube = require("youtube-node");
const Y = new YouTube();

Y.setKey(process.env.API_KEY);

module.exports = Y.search;
