const { prefix: defaultPrefix } = require('../../config.json');
const prefixManager = require('../utils/prefixManager');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.author.bot) return;

        // Get custom prefix for this guild or use default
        const prefix = message.guild 
            ? prefixManager.getPrefix(message.guild.id) 
            : defaultPrefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) 
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
    }
}; 