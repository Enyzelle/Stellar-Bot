const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Roll a dice with custom sides',
    execute(message, args) {
        const sides = parseInt(args[0]) || 6;
        
        if (sides < 2 || sides > 100) {
            return message.reply('Please specify a number between 2 and 100!');
        }

        const result = Math.floor(Math.random() * sides) + 1;
        
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('🎲 Dice Roll')
            .setDescription(`Rolling a ${sides}-sided dice...`)
            .addFields(
                { name: 'Result', value: `**${result}**` }
            )
            .setFooter({ 
                text: `Rolled by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        message.channel.send({ embeds: [embed] });
    }
}; 