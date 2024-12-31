const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (client) => {
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.blue('Loading Commands...'));
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

    const commandsPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(commandsPath).filter(file => {
        // Filter out system files and only get directories
        const stat = fs.statSync(path.join(commandsPath, file));
        return stat.isDirectory() && !file.startsWith('.');
    });

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const commandFiles = fs.readdirSync(folderPath).filter(file => {
            // Filter out system files and only get .js files
            return file.endsWith('.js') && !file.startsWith('.');
        });

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if ('name' in command && 'execute' in command) {
                client.commands.set(command.name, command);
                console.log(chalk.green(`✓ Loaded command: ${chalk.cyan(command.name)}`));
            } else {
                console.log(chalk.red(`✕ Failed to load ${chalk.cyan(file)}: Missing required properties`));
            }
        }
    }

    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green(`Loaded ${chalk.cyan(client.commands.size)} commands successfully!`));
    console.log(chalk.yellow('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}; 