const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');
const LyricsAuth = require('lyrics-search');
const lyricsAuth = new LyricsAuth();

module.exports = {
    name: 'lyrics',
    aliases: ['ly'],
    description: 'Get lyrics for the current song or search for lyrics',
    async execute(message, args, client) {
        let query;
        let artist;
        let title;

        // If no args, try to get current playing song
        if (!args.length) {
            const musicPlayer = require('../../utils/musicUtils')(client);
            const player = musicPlayer.getPlayer(message.guild);

            if (!player?.current) {
                return message.reply('❌ No song is playing! Try searching with: `lyrics <artist> - <song>`');
            }

            // Try to parse artist and title from current track
            const trackInfo = player.current.info;
            [artist, title] = parseTrackInfo(trackInfo.author, trackInfo.title);
        } else {
            // Parse args for artist and title
            query = args.join(' ');
            [artist, title] = parseSearchQuery(query);

            if (!artist || !title) {
                return message.reply('❌ Please use the format: `lyrics <artist> - <song>` or `lyrics <song>`');
            }
        }

        // Show loading message
        const loadingMsg = await message.channel.send('🔍 Searching for lyrics...');

        try {
            const lyrics = await lyricsAuth.searchLyrics(artist, title);

            if (!lyrics) {
                return loadingMsg.edit('❌ No lyrics found! Try being more specific with the artist name.');
            }

            // Split lyrics into chunks if too long
            const lyricsChunks = splitLyrics(lyrics);

            // Create embed for first chunk
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(`📜 Lyrics for ${title}`)
                .setDescription(lyricsChunks[0])
                .setFooter({ 
                    text: `Requested by ${message.author.tag} | Page 1/${lyricsChunks.length}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .addFields({ name: 'Artist', value: artist, inline: true });

            await loadingMsg.delete();
            const lyricsMsg = await message.channel.send({ embeds: [embed] });

            // If there are multiple chunks, add pagination reactions
            if (lyricsChunks.length > 1) {
                let currentPage = 0;
                const reactions = ['⬅️', '➡️'];
                
                for (const reaction of reactions) {
                    await lyricsMsg.react(reaction);
                }

                const filter = (reaction, user) => {
                    return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = lyricsMsg.createReactionCollector({ filter, time: 300000 });

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === '➡️') {
                        currentPage = currentPage + 1 < lyricsChunks.length ? currentPage + 1 : 0;
                    } else {
                        currentPage = currentPage - 1 >= 0 ? currentPage - 1 : lyricsChunks.length - 1;
                    }

                    embed.setDescription(lyricsChunks[currentPage])
                         .setFooter({ 
                             text: `Requested by ${message.author.tag} | Page ${currentPage + 1}/${lyricsChunks.length}`,
                             iconURL: message.author.displayAvatarURL({ dynamic: true })
                         });

                    await lyricsMsg.edit({ embeds: [embed] });
                    reaction.users.remove(message.author);
                });

                collector.on('end', () => {
                    lyricsMsg.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error));
                });
            }

        } catch (error) {
            console.error('Lyrics error:', error);
            loadingMsg.edit('❌ Error fetching lyrics! Please try again later.');
        }
    }
};

// Helper functions
function parseTrackInfo(author, title) {
    // Remove common suffixes and clean up title
    title = title.replace(/(\(Official.*?\))|(Official.*?$)|(ft\..*$)|(feat\..*$)|(\[.*?\])/gi, '').trim();
    return [author, title];
}

function parseSearchQuery(query) {
    // Check if query contains a separator
    const separators = [' - ', ' – ', ' — ', ' by '];
    let artist, title;

    for (const separator of separators) {
        if (query.includes(separator)) {
            [artist, title] = query.split(separator);
            return [artist.trim(), title.trim()];
        }
    }

    // If no separator found, assume it's just the title
    // and let the API try to find the artist
    return ['', query.trim()];
}

function splitLyrics(lyrics) {
    // Split lyrics into chunks of 4096 characters (Discord embed limit)
    const chunks = [];
    let currentChunk = '';
    const lines = lyrics.split('\n');

    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > 4000) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else {
            currentChunk += (currentChunk ? '\n' : '') + line;
        }
    }
    
    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
} 