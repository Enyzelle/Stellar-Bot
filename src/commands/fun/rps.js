const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rps',
    description: 'Play Rock, Paper, Scissors',
    execute(message, args) {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = args[0]?.toLowerCase();

        if (!userChoice || !choices.includes(userChoice)) {
            return message.reply('Please specify rock, paper, or scissors!');
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const result = getResult(userChoice, botChoice);
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };

        const embed = new EmbedBuilder()
            .setColor(result.color)
            .setTitle('Rock, Paper, Scissors')
            .addFields(
                { name: 'Your Choice', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
                { name: 'Bot Choice', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
                { name: 'Result', value: result.message }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};

function getResult(user, bot) {
    if (user === bot) return { message: "It's a tie! 🤝", color: '#FFFF00' };
    
    const wins = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    return wins[user] === bot 
        ? { message: 'You win! 🎉', color: '#00FF00' }
        : { message: 'You lose! 😢', color: '#FF0000' };
} 