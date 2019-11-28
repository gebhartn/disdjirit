const { readdirSync } = require("fs");
const ascii = require("ascii-table");

const table = new ascii().setHeading("command", "status");

module.exports = client => {
  readdirSync("./commands/").forEach(dir => {
    const commands = readdirSync(`./commands/${dir}`).filter(file =>
      file.endsWith(".js")
    );
    commands.forEach(f => {
      const pull = require(`../commands/${dir}/${f}`);
      pull.name
        ? (client.commands.set(pull.name, pull), table.addRow(f, "200"))
        : table.addRow(f, "500");

      // short circuit & validate type
      pull.aliases && Array.isArray(pull)
        ? pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        : null;
    });
  });

  console.log(table.toString());
};
