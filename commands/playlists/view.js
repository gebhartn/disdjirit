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
    // send message to chat
    const message = await msg.channel.send(`Fetching playlist`);
    // is the user trying to query another user
    const doesContentIncludeCharacter = content.includes("|");
    // content split into [song, playlist] format
    const newContent = doesContentIncludeCharacter
      ? joinTrimSplit(content)
      : [content.join(" ")];
    // boolean
    const contentLengthIsGreaterThanOne = newContent.length > 1;

    // if true, user has queried for a playlist by user
    if (contentLengthIsGreaterThanOne) {
      // destructure playlist and user for parsing
      const [playlist, user] = newContent;
      // extract numbers from user string
      const parsedUser = user.match(/\d/g);
      // if user is null, ping was invalid
      if (parsedUser !== null) {
        // join to string
        const userJoin = parsedUser.join("");
        // convert to number, form request body
        const body = { playlist, creator: parseInt(userJoin) };
        // axios post request
        const result = await viewPlaylist(`${baseURL}/${endpoint}`, body);
        // result returns error
        if (result.data.err) {
          message.edit(`Couldn't find playlist ${playlist}`);
        } else {
          // generate fields for rich embed
          const makeFields = result.data.map((song, index) => {
            return { name: `${index + 1}. ${song.name}`, value: song.url };
          });
          // created rich embed object
          const embed = {
            color: 0x000000,
            title: playlist,
            fields: makeFields
          };
          // include embed as message edit
          message.edit({ embed });
        }
      } else {
        message.edit(`${user} is not a valid user request`);
      }
    } else {
      // extract playlist as a string
      const [playlist] = newContent;
      // form request body
      const body = { playlist, creator };
      // axios post request
      const result = await viewPlaylist(`${baseURL}/${endpoint}`, body);
      // result returns error
      if (result.data.err) {
        message.edit(`Couldn't find playlist ${playlist}`);
      } else {
        // generate fields for rich embed
        const makeFields = result.data.map((song, index) => {
          return { name: `${index + 1}. ${song.name}`, value: song.url };
        });
        // created rich embed object
        const embed = {
          color: 0x000000,
          title: playlist,
          fields: makeFields
        };
        // include embed as message edit
        message.edit({ embed });
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
