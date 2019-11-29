const searchYoutube = require("../../services/search-youtube");
const insertSong = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "api/playlists/add";

module.exports = {
  name: "add",
  category: "playlists",
  description: "adds song to a playlist",
  run: async (client, msg, content) => {
    const creator = parseInt(msg.author.id);
    const [song, playlist] = joinTrimSplit(content);
    const message = await msg.channel.send(`Adding ${song} to ${playlist}`);
    if (!playlist) {
      message.edit(`ERROR: Must provide a playlist name`);
    } else {
      try {
        searchYoutube(song, 1, (err, res) => {
          const [video] = res.items;
          const name = video.snippet.title;
          const url = video.id.videoId;
          if (err) console.log(err);
          insertSong(`${baseURL}/${endpoint}`, {
            playlist,
            creator,
            name,
            url: `https://www.youtube.com/watch?v=${url}`
          }).then(server => {
            server.data
              ? message.edit(`Added ${name} to ${playlist}`)
              : message.edit(`You don't own a playlist called ${playlist}`);
          });
        });
      } catch (err) {
        message.edit(`ERROR: failed to add ${song}`);
        console.error({ err: err.message });
      }
    }
  }
};

// separate song query from playlist name
function joinTrimSplit(arr) {
  return arr
    .join(" ")
    .trim()
    .split(" | ");
}
