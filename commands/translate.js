const {
    ContextMenuCommandBuilder
} = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('translatoooor')
        .setType(3),
    async execute(interaction) {
        const translation = await axios.post('https://translatooooor.up.railway.app/api/translate/translate', {
            request: interaction.targetMessage.content
        })
        await interaction.reply(`dis translaits to: ${translation.data.translation}`);
    },
};