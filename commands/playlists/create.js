const insertPlaylist = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "api/playlists/create";

module.exports = {
  name: "create",
  category: "playlists",
  description: "create a new playlist",
  run: async (client, msg, content) => {
    // get discord user id
    const creator = parseInt(msg.author.id);
    // get playlist name
    const name = content.join(" ");
    // post object
    const body = { creator, name };
    // confirm command was received
    const message = await msg.channel.send(`Creating new playlist: ${name}`);

    if (!name.length) {
      // return if no playlist name is provided
      message.edit(`ERROR: Must provide a playlist name`);
    } else {
      try {
        // axios post, returns playlist findBy -> name
        await insertPlaylist(`${baseURL}/${endpoint}`, body);
        message.edit(`Created playlist: ${name}`);
      } catch (err) {
        message.edit(`ERROR: failed to create ${name}`);
        console.error({ err: err.message });
      }
    }
  }
};
