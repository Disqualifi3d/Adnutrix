require("dotenv").config()

const noblox = require("noblox.js")
const fs = require("fs").promises
const express = require("express")
const REST = require("@discordjs/rest")
const adnutrixsettings = require("./utilities/Settings.js")
const {Client, SlashCommandBuilder, GatewayIntentBits, } = require("discord.js")
const { joinVoiceChannel } = require("@discordjs/voice")
const { connect } = require("http2")

const token = process.env.discord_token
const prefix = ";"

const app = express()
app.use(express.json())
const commandList = []

const rest = new REST.REST({version: "10"}).setToken(token)

const Bot = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


// SETUP \\

print = (Data) => {
    console.log(Data)
}


app.get(`/get`, async (r, response) => { // Sends message
    response.status(200).send(Bot.request);
});

let listener = app.listen(process.env.port, () => {
    print(`Your app is currently listening on port: ${listener.address().port}`);
});

let testing = adnutrixsettings.testing
let server = adnutrixsettings.guild
let importantChannels = adnutrixsettings.channels

Bot.Common_Embed = async (author, title, description) => {
    let embed = new Discord.EmbedBuilder()
    embed.setColor("Blue");
    embed.setAuthor({
        iconURL: author.displayAvatarURL(),
        name: `${author.globalName} (@${author.username})`
    })
    embed.setTitle(title);
    embed.setDescription(description);
    embed.setFooter()
    embed.setTimestamp()
    return embed;
};

Bot.requestTimeout = 5 * 1000 // -- 5s
Bot.allowedRanks = "Staff,Development Team,Me,Game Owner".split(",")
Bot.Request = ""


// FUNCTIONS \\

let readCommandFiles = async () => {
    let files = await fs.readdir(`${__dirname}/commands`);

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.endsWith(".js")) throw new Error(`Invalid file detected in commands folder, please remove this file for the bot to work: ${file}`);
        let coreFile = require(`${__dirname}/commands/${file}`);
        commandList.push({
            file: coreFile,
            name: file.split('.')[0]
        });
    }
}


let getFile = async (name) => {


    let index = commandList.findIndex(cmd => cmd.name === name);
    if (index == -1) return print("something happened");
        
    return commandList[index].file
}

// CONNECTIONS \\

Bot.on("clientReady", async () => {

    const Connection = joinVoiceChannel({
        channelId: adnutrixsettings.vcChannel,
        guildId: adnutrixsettings.guild,
        adapterCreator: Bot.guilds.cache.get(adnutrixsettings.guild).voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    })

    await readCommandFiles()

    //let channel = Bot.fetchThisChannel(importantChannels.general)
    //channel.send("Online")

    require("./utilities/CommandRegistration.js")

    Bot.request = "No Request"
})


Bot.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "adnutrixtest") {
        interaction.reply("hi")
    }

    if (interaction.commandName === "info") {
        let file = await getFile(interaction.commandName)

        let args = {
            username: interaction.options.getString("username"),
            id: interaction.options.getNumber("id")
        }

        file.run(interaction, Bot, args).catch((err) => {
            interaction.reply(`An error occurred while running this command contact disqualifi3d to fix this issue. Error: ${err}`)
        })

    }

    if (interaction.commandName == "kick") {
        let file = await getFile(interaction.commandName)
        let args = {
            reason: interaction.options.getString("reason"),
            username: interaction.options.getString("username"),
            id: interaction.options.getNumber("id")
        }
        file.run(interaction, Bot, args).catch((err) => {
            interaction.reply(`An error occurred while running this command contact disqualifi3d to fix this issue. Error: ${err}`)
        })
    }

    if (interaction.commandName === "sendmessage") {
        let file = await getFile(interaction.commandName)
        let args = {
            message: interaction.options.getString("message")
        }
        file.run(interaction, Bot, args).catch((err) => {
            interaction.reply(`An error occurred while running this command contact disqualifi3d to fix this issue. Error: ${err}`)
        })
    }

    

})


Bot.on("messageCreate", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


})



// EXTRA CUSTOM BOT FUNCTIONS \\

Bot.fetchThisChannel = (C) => {
    let sv = Bot.guilds.cache.get(adnutrixsettings.guild)
    let channel = (sv && sv.channels.cache.get(C)) || null
    if (channel) return channel
}

Bot.login(token)

// MAIN \\

app.post(`/verify-request`, async (request, response) => {
    let headers = request.headers
    let status  = headers.status
    
    

    return response.sendStatus(200);
});