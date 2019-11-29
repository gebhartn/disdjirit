const { readdirSync } = require("fs");
const ascii = require("ascii-table");

// print ascii table to console on init
const table = new ascii().setHeading("command", "status");

module.exports = client => {
  readdirSync("./commands/").forEach(dir => {
    // confirm file is actually a js extension
    const commands = readdirSync(`./commands/${dir}`).filter(file =>
      file.endsWith(".js")
    );
    commands.forEach(f => {
      // extract name/category/description/function from f.js
      const pull = require(`../commands/${dir}/${f}`);
      // assign command name with command file, print command table to console
      pull.name
        ? (client.commands.set(pull.name, pull), table.addRow(f, "200"))
        : table.addRow(f, "500");

      // short circuit & validate type on alias
      pull.aliases && Array.isArray(pull)
        ? pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        : null;
    });
  });

  console.log(table.toString());
};
