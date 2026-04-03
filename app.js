require("dotenv").config()

const noblox = require("noblox.js")
const fs = require("fs").promises
const express = require("express")
const REST = require("@discordjs/rest")
const adnutrixsettings = require("./utilities/Settings.js")
const {Client, SlashCommandBuilder, GatewayIntentBits, } = require("discord.js")
const { joinVoiceChannel } = require("@discordjs/voice")
const { connect } = require("http2")
const { stat } = require("fs")

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

    console.log(request)
    
    if (stats == "Test") {

        let channel = bot.fetchThisChannel(adnutrixsettings.channels.ranks)

        if (!channel) return print("Couldn't find the channel to send the test message in.");

        channel.send("endpoint is working")

    }

    if (status == "Completion") {

        let body = request.body
        let serverId = "584891032202772517"
        let channelId = "731611756283035751"
        let sv = client.guilds.cache.get(serverId)
        let channel = (sv && sv.channels.cache.get(channelId)) || null

        let time = await adnutrixsettings.formatTime(body.Session_Time)

        let Ranks = {
            F: { Min: -100, Max: 50, color: [1, 1, 1], icon: "" },
            D: { Min: 50, Max: 60, color: [10, 99, 194], icon: "https://tr.rbxcdn.com/74696bb0924f1a8214aa7c5a485e3688/420/420/Image/Png" },
            C: { Min: 60, Max: 75, color: [10, 194, 108], icon: "https://tr.rbxcdn.com/833b4eafbadf566dad74f0abcaffbb4b/420/420/Image/Png" },
            B: { Min: 75, Max: 90, color: [153, 161, 40], icon: "https://tr.rbxcdn.com/509313f8f29a571a4c20fddeb1d667a9/420/420/Image/Png" },
            A: { Min: 90, Max: 100, color: [173, 91, 24], icon: "https://tr.rbxcdn.com/d8dff3058a3270899ee4050d8707c9f0/420/420/Image/Png" },
            S: { Min: 100, Max: 200, color: [115, 53, 150], icon: "https://tr.rbxcdn.com/09310620b57d7c75528091a006a054e7/420/420/Image/Png" },
            SS: { Min: 200, Max: 250, color: [145, 63, 191], icon: "https://tr.rbxcdn.com/94276926c27121f8c6457218f21d3d51/420/420/Image/Png" },
            SSS: { Min: 250, Max: 300, color: [224, 29, 202], icon: "https://tr.rbxcdn.com/fe0097689830b631221cce290cbd7817/420/420/Image/Png" },
            Omega: { Min: 300, Max: 100000000000000000000, color: [225, 225, 225], icon: "https://tr.rbxcdn.com/9b4dd639d76bfbaa5577b8aee552f2cb/420/420/Image/Png" },
        }

        let Mode_Thumbnails = {
            Casual: { name: "Casual", icon: "https://tr.rbxcdn.com/a26063487122c3da5e73be1e5e50113d/420/420/Image/Png" },
            Default: { name: "Default", icon: "https://tr.rbxcdn.com/5dd09e76583266f8933fea40cd6b7d34/420/420/Image/Png" },
            Competitive: { name: "Competitive", icon: "https://tr.rbxcdn.com/9068066de278c472788853442b0a123b/420/420/Image/Png" },
            Legacy: { name: "Legacy", icon: "https://tr.rbxcdn.com/4aa718a67f523d85489e366cc1d33df8/420/420/Image/Png" },
            "Rush Hour": { name: "Rush Hour", icon: "https://tr.rbxcdn.com/1d9cb20976d6d0b541eb257b7dd6b8bf/420/420/Image/Png" },
            ULTRADEFENSE: { name: "ULTRADEFENSE", icon: "https://tr.rbxcdn.com/f0f6a5369a46ce4a1c4c521ec9d64ea1/420/420/Image/Png" },
            "DEMONHUNTERS MUST DIE": { name: "DEMONHUNTERS MUST DIE", icon: "https://tr.rbxcdn.com/9c9ae0cec6705e53e5ac502b65b32e82/420/420/Image/Png" },
            "Hyperstyle Glory": { name: "Hyperstyle Glory", icon: "https://tr.rbxcdn.com/3a1f0f840d51f04677820f2e07319bd4/420/420/Image/Png" },
            Custom: { name: "Custom", icon: "https://tr.rbxcdn.com/7095a23de4cce4f92dcf5a77fafccc05/420/420/Image/Png" },
        }

        let Rank = null
        let skill = body.Skill

        let game_mode = body.Game_Mode
        let mode_Icon = ""

        for (let [index, value] of Object.entries(Mode_Thumbnails)) {
            if (game_mode === value.name) {
                mode_Icon = value.icon
            }
        }

        for (let [index, value] of Object.entries(Ranks)) {
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

        let embed = new Discord.EmbedBuilder()

        embed.setColor(Rank.color)
        if (Rank.icon) { embed.setThumbnail(Rank.icon) };

        embed.setImage(mode_Icon)

        embed.setTitle(body.Title)
        embed.setDescription(`
        ## Match Stats
        Game Mode: ${game_mode}
        Server Type: ${request.headers.servertype}
        Wave Reached: ${body.Wave_Reached}
        Session Time: ${time}
        ## Team Stats
        Kills: ${body.Total_Kills}
        XP: ${body.Total_XP}
        Damage: ${body.Total_Damage}
        Casualties: ${body.Total_Casualties}
        ## Players
        ${Players}## Bossfights
        `)

        for (let [index, value] of Object.entries(body.BossTimes)) {
            let bossTime = await timeFormat(value.Time)
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
        channel.send({ embeds: [embed] })

    }

    return response.sendStatus(200);
});