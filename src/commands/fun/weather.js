const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../../config.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'weather',
    description: 'Get weather information for a location',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a location!');
        }

        const location = args.join(' ');
        const API_KEY = 'your_weather_api_key'; // You'll need to get this from a weather API service
        
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (data.error) {
                return message.reply('❌ Location not found!');
            }

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setAuthor({ name: `🌤️ Weather in ${data.location.name}` })
                .setThumbnail(`https:${data.current.condition.icon}`)
                .addFields(
                    { name: 'Condition', value: data.current.condition.text, inline: true },
                    { name: 'Temperature', value: `${data.current.temp_c}°C / ${data.current.temp_f}°F`, inline: true },
                    { name: 'Feels Like', value: `${data.current.feelslike_c}°C / ${data.current.feelslike_f}°F`, inline: true },
                    { name: 'Humidity', value: `${data.current.humidity}%`, inline: true },
                    { name: 'Wind', value: `${data.current.wind_kph} km/h`, inline: true },
                    { name: 'Last Updated', value: data.current.last_updated, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `By Enyzelle`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Error fetching weather data!');
        }
    }
}; 