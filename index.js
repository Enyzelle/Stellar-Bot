const { Client, Collection, GatewayIntentBits, GatewayDispatchEvents } = require('discord.js');
const { Riffy } = require('riffy');
const { token, lavalink: { nodes } } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

client.commands = new Map();
client.commands = new Collection();
client.aliases = new Map();

// Initialize Riffy
client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "spsearch",
    restVersion: "v4"
});

// Load handlers
const handlersPath = path.join(__dirname, 'src/handlers');
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

for (const file of handlerFiles) {
    require(`${handlersPath}/${file}`)(client);
}

// Handle voice state updates
client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
});

client.login(token); 