const { EmbedBuilder } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    name: 'ascii',
    description: 'Convert text to ASCII art',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide some text to convert!');
        }

        const text = args.join(' ');
        if (text.length > 20) {
            return message.reply('Text must be 20 characters or less!');
        }

        figlet(text, (err, data) => {
            if (err) {
                return message.reply('Something went wrong!');
            }
            message.channel.send(`\`\`\`${data}\`\`\``);
        });
    }
}; 