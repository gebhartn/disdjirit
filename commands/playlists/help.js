module.exports = {
  name: "help",
  category: "playlists",
  description: "displays a help message",
  run: async (client, msg, args) => {
    // todo: pull commands from fs
    const message = await msg.channel.send(`loading up my brain`);
    const embed = {
      color: 0x000000,
      title: "Command List",
      fields: [
        {
          name: "Create a playlist",
          value: `::create *playlist name*`
        },
        {
          name: "Add to your playlist",
          value: `::add *song name* | *playlist name*`
        },
        {
          name: "View your playlist",
          value: `::view *playlist name*`
        },
        {
          name: "View a user's playlist",
          value: `::view *playlist name* | @user`
        }
      ]
    };
    message.edit({ embed });
  }
};
