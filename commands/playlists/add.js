const searchYoutube = require("../../services/search-youtube");
const insertSong = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "api/playlists/add";

module.exports = {
  name: "add",
  category: "playlists",
  description: "adds song to a playlist",
  run: async (client, msg, content) => {
    // get discord user id
    const creator = parseInt(msg.author.id);
    // extract song name and playlist name from message
    const [song, playlist] = joinTrimSplit(content);
    // send message, confirms command worked
    const message = await msg.channel.send(`Adding ${song} to ${playlist}`);
    // if no playlist name return error
    if (!playlist) {
      message.edit(`ERROR: Must provide a playlist name`);
    } else {
      try {
        // query youtube, (song name, number of results, cb)
        searchYoutube(song, 1, (err, res) => {
          // extract first object from result array
          const [video] = res.items;
          // video title
          const name = video.snippet.title;
          // video endpoint
          const url = video.id.videoId;
          if (err) console.log(err);
          // axios post
          insertSong(`${baseURL}/${endpoint}`, {
            playlist,
            creator,
            name,
            url: `https://www.youtube.com/watch?v=${url}`
          }).then(server => {
            // post returns boolean based on viable inputs
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
