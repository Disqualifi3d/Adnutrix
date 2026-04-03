require("dotenv").config()

const noblox = require("noblox.js")
const fs = require("fs").promises
const express = require("express")
const REST = require("@discordjs/rest")
const adnutrixsettings = require("./utilities/Settings.js")
const {Client, SlashCommandBuilder, GatewayIntentBits, Embed, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const { joinVoiceChannel } = require("@discordjs/voice")
const { connect } = require("http2")
const { stat } = require("fs")
const { settings } = require("cluster")

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

    console.log(headers)
    console.log(request.body)
    
    if (status == "Test") {

        let channel = Bot.fetchThisChannel(adnutrixsettings.channels.ranks)

        if (!channel) return print("Couldn't find the channel to send the test message in.");

        channel.send("endpoint is working")

    }

    if (status == "Completion") {

        let body = request.body
        let serverId = adnutrixsettings.guild
        let channelId = adnutrixsettings.channels.ranks
        let sv = Bot.guilds.cache.get(serverId)
        let channel = (sv && sv.channels.cache.get(channelId)) || null

        let time = await adnutrixsettings.formatTime(body.Session_Time)

        let Rank = null
        let skill = body.Skill

        let game_mode = body.Game_Mode
        let mode_Icon = ""

        for (let [index, value] of Object.entries(adnutrixsettings.modeimages)) {
            if (game_mode === value.name) {
                mode_Icon = value.icon
            }
        }

        for (let [index, value] of Object.entries(adnutrixsettings.rankimages)) {
            if (skill > value.Min && skill <= value.Max) {
                Rank = value
            }
        }

        let Players = ``
        for (let i = 0; i < body.Players.length; i++) {
            let Data = body.Players[i]
            console.log(Data)

            Players = Players + `[${Data.Level.toString()}] - ${Data.Name}\n`
        }

        let embed = new EmbedBuilder()
        let files = [];

        embed.setColor(Rank.color)
        if (Rank.icon) {
            files.push(new AttachmentBuilder(Rank.icon, { name: "rank.png" }));
            embed.setThumbnail("attachment://rank.png");
        }
        
        if (mode_Icon) {
            files.push(new AttachmentBuilder(mode_Icon, { name: "mode.png" }));
            embed.setImage("attachment://mode.png");
        }

        embed.setTitle(body.Title)
        embed.setDescription(`
## ---- Match Stats ----
Game Mode: ${game_mode}
Server Type: ${request.headers.servertype}
Wave Reached: ${body.Wave_Reached}
Session Time: ${time}
## ---- Team Stats ----
Kills: ${body.Total_Kills}
XP: ${body.Total_XP}
Damage: ${body.Total_Damage}
Casualties: ${body.Total_Casualties}
## ---- Players ----
${Players}
## ---- Bossfights ----
        `)

        for (let [index, value] of Object.entries(body.BossTimes)) {
            let bossTime = await adnutrixsettings.formatTime(value.Time)
            embed.addFields({
                name: `__${index}__`,
                value: `
        Time: ${bossTime}
        Score: ${value.Score}
        BYF: ${value.BYF}
                    `,
                inline: true
            })
        }

        /*
        for (let i = 0; i < body.Players.length; i++) {
            let Data = body.Players[i]
    
            if (Data && Data.Name && Data.Level) {
                embed.addFields({
                name: Data.Name,
                value: `Level: ${Data.Level.toString()}`,
                inline: true
            })
            }
        }
        */
        channel.send(
            {
                embeds: [embed],
                files: files.length > 0 && files || [] 
            }
        )

    }

    return response.sendStatus(200);
});