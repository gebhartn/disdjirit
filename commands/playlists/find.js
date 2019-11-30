const findPlaylists = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "api/playlists/find";

module.exports = {
  name: "list",
  category: "playlists",
  description: "find playlists by user name",
  run: async (client, msg, content) => {
    const creator = parseInt(msg.author.id);
    const message = await msg.channel.send(`Fetching playlist`);
    if (!content.length) {
      const result = await findPlaylists(`${baseURL}/${endpoint}`, { creator });
      const makeFields = result.data.map((song, index) => {
        return { name: `${index + 1}. Playlist name:`, value: `${song.name}` };
      });
      // created rich embed object
      const embed = {
        color: 0x000000,
        title: `${msg.author.username}'s playlists:`,
        fields: makeFields
      };
      // include embed as message edit
      message.edit({ embed });
    } else {
      const parsed = content[0].match(/\d/g);
      const joined = parsed.join("");
      const creator = parseInt(joined);
      const result = await findPlaylists(`${baseURL}/${endpoint}`, { creator });
      const makeFields = result.data.map((song, index) => {
        return { name: `${index + 1}. Playlist name:`, value: `${song.name}` };
      });
      // created rich embed object
      const userObject = await client.fetchUser(joined);
      const embed = {
        color: 0x000000,
        title: `${userObject.username}'s playlists:`,
        fields: makeFields
      };
      message.edit({ embed });
    }
  }
};
