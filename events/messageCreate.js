const client = require("../index");
const Levels = require("discord-xp");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.config.prefix)) return;

  const random = Math.floor(Math.random() * 34) + 1;
  const hasLevelledUp = await Levels.appendXp(message.author.id, message.guild.id, random);
  if (hasLevelledUp) {
    const user = await Levels.fetch(message.author.id, message.guild.id);
    message.channel.send(`Congratulation ${message.author}! You've been levelled up to level ${user.level}.`);
  }

  const [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(" ");

  const command = client.commands.get(cmd.toLowerCase());

  if (!command) return;
  await command.run(client, message, args);
  const userperm = message.member.permissions.has(command.userperm);
  const botperm = message.guild.me.permissions.has(command.botperm);
  if (!userperm) return message.reply({ content: `You need \`${command.userperm || []}\` Permissions` });
  if (!botperm) return message.reply({ content: `I need \`${command.botperm || []}\` Permissions` });
});