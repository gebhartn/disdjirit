module.exports = {
  validateViableInputs: async (msg, prefix) => {
    // no bots allowed
    if (msg.author.bot) return;
    // out of server
    if (!msg.guild) return;
    // no command prefix
    if (!msg.content.startsWith(prefix)) return;
    // sometimes members don't update, drops command
    if (!msg.member) msg.member = await msg.guild.fetchMember(message);
  },
  checkCommandOrAliasExists: (client, msg, args, cmd) => {
    let command = client.commands.get(cmd);
    // command -> alias -> do nothing
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    // invoke command function
    if (command) command.run(client, msg, args);
  }
};
