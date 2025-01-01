const { EmbedBuilder } = require('discord.js')
const { embedColor } = require('../../../config.json')

module.exports = {
    name: 'help',
    aliases: [''],
    description: 'Shows all of the bot\'s commands.',
    async execute(message, args, client) {
        const helpEmbed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} Help` })
        .setColor(embedColor)
        .setDescription(`
            ✅ [Click Here](https://stellar-bot-web.vercel.app/commands.html) for a list of commands
            \n
            ❓ New to Stellar? Check out our [FAQ](https://stellar-bot-web.vercel.app/faq.html)
            \n
            📄 Still need help? [Click Here](https://test.com) to join our Discord server
            `);
        await message.channel.send({ embeds: [helpEmbed] })
    }
}