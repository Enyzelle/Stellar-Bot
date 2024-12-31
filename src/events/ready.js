const figlet = require('figlet');
const { presence } = require('../../config.json');
const chalk = require('chalk'); // Add chalk to package.json for colored console

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Create ASCII art
        figlet.text('STELLAR BOT', {
            font: 'ANSI Shadow',
            horizontalLayout: 'fitted',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }, function(err, data) {
            if (err) {
                console.error('Something went wrong with figlet');
                return;
            }

            // Print ASCII art and bot info
            console.log(chalk.cyan(data));
            console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.magenta('Bot Information:'));
            console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.blue('➣ Client:'), chalk.green(client.user.tag));
            console.log(chalk.blue('➣ Status:'), chalk.green(presence.status));
            console.log(chalk.blue('➣ Guilds:'), chalk.green(client.guilds.cache.size));
            console.log(chalk.blue('➣ Users:'), chalk.green(client.users.cache.size));
            console.log(chalk.blue('➣ Commands:'), chalk.green(client.commands.size));
            console.log(chalk.blue('➣ Discord.js:'), chalk.green(require('discord.js').version));
            console.log(chalk.blue('➣ Node.js:'), chalk.green(process.version));
            console.log(chalk.white('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        });

        // Set up rotating activities
        let currentActivity = 0;
        
        // Set initial activity
        updateActivity();

        // Rotate activities every 15 seconds
        setInterval(() => {
            updateActivity();
        }, 15000);

        function updateActivity() {
            const activity = presence.activities[currentActivity];
            
            client.user.setPresence({
                activities: [{
                    name: formatActivityName(activity.name, client),
                    type: getActivityType(activity.type)
                }],
                status: presence.status
            });

            // Move to next activity
            currentActivity = (currentActivity + 1) % presence.activities.length;
        }

        // Log successful login with timestamp
        console.log(chalk.green(`[${new Date().toLocaleString()}] ${client.user.tag} is ready to rock! 🚀`));
    }
};

// Helper functions
function formatActivityName(name, client) {
    return name
        .replace('{guilds}', client.guilds.cache.size)
        .replace('{users}', client.users.cache.size)
        .replace('{prefix}', require('../../config.json').prefix);
}

function getActivityType(type) {
    const types = {
        'PLAYING': 0,
        'STREAMING': 1,
        'LISTENING': 2,
        'WATCHING': 3,
        'COMPETING': 5
    };
    return types[type] || 0;
} 