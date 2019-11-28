const insertPlaylist = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "/api/playlists/create";

module.exports = {
  name: "create",
  category: "playlists",
  description: "create a new playlist",
  run: async (client, msg, content) => {
    const creator = parseInt(msg.author.id);
    const name = content.join(" ");
    const body = { creator, name };
    const message = await msg.channel.send(`Creating new playlist: ${name}`);

    try {
      content.length
        ? (await insertPlaylist(`${baseURL}/${endpoint}`, body),
          message.edit(`Created playlist: ${name}`))
        : message.edit(`Enter a playlist name`);
    } catch (err) {
      message.edit(`ERROR: failed to create ${name}`);
      console.error({ err: err.message });
    }
  }
};
