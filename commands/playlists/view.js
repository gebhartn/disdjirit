const viewPlaylist = require("../../services/axios-post");
const baseURL = process.env.BASE_URL;
const endpoint = "api/playlists/view";

module.exports = {
  name: "view",
  category: "playlists",
  description: "view playlist by name",
  run: async (client, msg, content) => {
    // get discord user id
    const creator = parseInt(msg.author.id);

    // is the user trying to query another user
    const doesContentIncludeCharacter = content.includes("|");
    // content split into [song, playlist] format
    const newContent = doesContentIncludeCharacter
      ? joinTrimSplit(content)
      : content;
    // boolean
    const contentLengthIsGreaterThanOne = newContent.length > 1;

    if (contentLengthIsGreaterThanOne) {
      const [playlist, user] = newContent;
      const parsedUser = user.match(/\d/g);
      if (parsedUser !== null) {
        const userJoin = parsedUser.join("");
        const body = { playlist, user: parseInt(userJoin) };
        await viewPlaylist(`${baseURL}/${endpoint}`, body);
      }
    }
  }
};

function joinTrimSplit(arr) {
  return arr
    .join(" ")
    .trim()
    .split(" | ");
}
