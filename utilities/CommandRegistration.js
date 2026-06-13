const adnutrixsettings = require("./Settings.js")
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js")

require("dotenv").config()

const rest = new REST({ version: "10" }).setToken(process.env.discord_token);

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
            },
        ]
    },
    {
        name: "kick",
        description: "Kick a user from the game (choose one external option)",
        options : [
            {
                name: "reason",
                description: "The reason for the kick",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "username",
                description: "The Roblox username of the user you want to kick",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "id",
                description: "The Roblox ID of the player you want to kick",
                type: ApplicationCommandOptionType.Number
            },
            
        ]
    },
    {
        name: "ban",
        description: "Ban a user from the game (choose one external option)",
        options: [
            {
                name: "displayreason",
                description: "What shows up to the user when they try to join the game",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "privatereason",
                description: "The full reason for the ban (only visible to staff)",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "duration",
                description: "The duration of the ban in seconds (-1 for permanent)",
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: "game",
                description: "The game you want to ban the user from",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "Main Game",
                        value: "Main",
                    },
                    {
                        name: "Test Game",
                        value: "Test",
                    }
                ],
                required: true
            },
            {
                name: "username",
                description: "The Roblox username of the user you want to ban",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "id",
                description: "The Roblox ID of the player you want to ban",
                type: ApplicationCommandOptionType.Number
            },
        ]
    },
    {
        name: "sendmessage",
        description: "Sends a message to every active server",
        options: [
            {
                name: "message",
                description: "The message you want to send",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
];



(async () => {
    try {
        console.log("refreshing slash commands")

        await rest.put(
            Routes.applicationGuildCommands(process.env.client_id, adnutrixsettings.guild),
            {
                body: commands
            }
        )

        console.log("slash commands done!")
    } catch (error) {
        console.log(error)
    }
})()