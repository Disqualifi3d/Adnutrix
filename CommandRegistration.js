const AdnutrixUtils = require("./AdUtilities.js")
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")

require("dotenv").config()

const commands = [
    {
        name: "adnutrixtest",
        description: "This is just a test"
    },
    {
        name: "info",
        description: "Get info about the player (choose one option only)",
        options : [
            {
                name: "username",
                description: "The Roblox username you want to get info about",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "id",
                description: "The Roblox ID of the player you want to get info about",
                type: ApplicationCommandOptionType.Number
            }
        ]
    },
];

const rest = new REST({ version: "10" }).setToken(process.env.discord_token);

(async () => {
    try {
        console.log("refreshing slash commands")

        await rest.put(
            Routes.applicationGuildCommands(process.env.client_id, AdnutrixUtils.guild),
            {
                body: commands
            }
        )

        console.log("slash commands done!")
    } catch (error) {
        console.log(error)
    }
})()