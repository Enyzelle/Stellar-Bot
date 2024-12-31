const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'meme',
    description: 'Get a random meme',
    async execute(message) {
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(data.title)
            .setURL(data.postLink)
            .setImage(data.url)
            .setFooter({ 
                text: `👍 ${data.ups} | From r/${data.subreddit} | By: Enyzelle`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 