require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const statisticMap = {
    PlayerTotalWins: 'total wins',
    PlayerTotalDeaths: 'total deaths',
    PlayerTotalMatches: 'total matches',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('get the leaderboards for the server')
        .addStringOption((option) =>
            option
                .setName('statistic')
                .setDescription('the stat to get the leaderboard for')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'total wins',
                        value: 'PlayerTotalWins',
                    },
                    {
                        name: 'total deaths',
                        value: 'PlayerTotalDeaths',
                    },
                    {
                        name: 'total matches',
                        value: 'PlayerTotalMatches',
                    }
                )
        ),
    async execute(interaction) {
        const leaderboardCategory = interaction.options.getString('statistic');
        const requestData = JSON.stringify({
            MaxResultsCount: 5,
            StartPosition: 0,
            StatisticName: leaderboardCategory,
            ProfileConstraints: {
                ShowLinkedAccounts: true,
            },
        });
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://956AC.playfabapi.com/Server/GetLeaderboard',
            headers: {
                'X-SecretKey': process.env.PLAYFAB_SECRET_KEY,
                'Content-Type': 'application/json',
            },
            data: requestData,
        };
        axios(config)
            .then(function (response) {
                let responseString = `here is the **${statisticMap[leaderboardCategory]}** leaderboard: \n`;
                for (const statistic of response.data.data.Leaderboard) {
                    responseString += `**${statistic.Position + 1}** - ${
                        statistic.Profile.LinkedAccounts[0].Username
                    } with **${statistic.StatValue}** ${
                        statisticMap[leaderboardCategory].split(' ')[1]
                    }\n`;
                }
                interaction.reply(responseString);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
};
