console.log("------------------------------------------------------------------------------------------------------------------------------------------------")

require("dotenv").config()
const express = require('express');
const Discord = require('discord.js');

const REST = require("@discordjs/rest")
const token = process.env.discord_token;
const prefix = ";";
const fs = require('then-fs');
const Trello = require("trello");



const app = express();
app.use(express.json())
const commandList = [];

const noblox = require("noblox.js")
//require('dotenv').config();

const rest = new REST.REST({ version: "10" }).setToken(token)
const client = new Discord.Client({intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ],
})

var debugging = false
let update = false

client.embedMaker = (author, title, description) => {
    let embed = new Discord.EmbedBuilder()
    embed.setColor("Blue");
    embed.setAuthor({
        iconURL: author.displayAvatarURL(),
        name: `${author.globalName} (@${author.username})`
    })

    embed.setTitle(title);
    embed.setDescription(description);
    return embed;
}
client.maxTimeout = 5 * 1000 // 5 seconds
client.allowedRanks = "Staff,Development Team,Me,Game Owner".split(",")

let createEmbed = async () => {
    let embed = new Discord.EmbedBuilder()
    
    embed.setAuthor({
        iconURL: client.user.displayAvatarURL(),
        name: "Adnutrix"
    })
    embed.setColor("Blue")

    return embed
}

let timeFormat = async (time) => {
    let hours = Math.floor(time / (60 * 60))
    let minutes = Math.floor(time / 60) % 60
    let seconds = Math.floor(time) % 60

    if (hours > 0) {
        hours = `${hours}h`
    } else if (hours <= 0) {
        hours = ""
    }

    return (`${hours} ${minutes}m ${seconds}s`)
}

/*
app.get('/', async (r, response) => {
    response.sendStatus(200);
});
*/

app.get(`/`, async (r, response) => { // Sends message
    response.status(200).send(client.request);
});

let listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is currently listening on port: ${listener.address().port}`);
});



let readCommandFiles = async () => {
    let files = await fs.readdir(`${__dirname}/commands`);

    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        if (!file.endsWith(".js")) throw new Error(`Invalid file detected in commands folder, please remove this file for the bot to work: ${file}`);
        let coreFile = require(`${__dirname}/commands/${file}`);
        commandList.push({
            file: coreFile,
            name: file.split('.')[0]
        });
    }
}

client.on('ready', async () => { // immediately runs when the bot is online

    let serverId = "584891032202772517"
    let channelId = "802333970943311953"

    let server = client.guilds.cache.get(serverId)
    if (!server) return

    let channel = server.channels.cache.get(channelId)
    if (!channel) {
        return
    }

    console.log(`Logged into the Discord account - ${client.user.tag}`);

    client.user.setActivity(";help", { type: "LISTENING" })

    await readCommandFiles();
    client.request = "No request";
    client.commandList = commandList;
});

client.on("messageCreate", async message => { // This block runs whenever something is written
    
    
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).split(" ");

    if (args[0].toLowerCase() === "debugging") {
        if (args[1] == "false") {
            message.channel.send("✅ Bot is enabled in public servers")
            debugging = false
        } else if (args[1] == "true") {
            message.channel.send("✅ Bot is studio-only")
            debugging = true
        } else {
            message.channel.send("what")
        }
    } else {
        let command = args.shift().toLowerCase();
        let index = commandList.findIndex(cmd => cmd.name === command);
        if (index == -1) return console.log("something happened");
        
        commandList[index].file.run(message, client, args, debugging);
    }
});


client.login(token).then(async () => {
    console.log("working")
}).catch(async (err) => {
    console.log(err)
    client.login(token)
})

app.post(`/`, async (request, response) => {
    let commandRequest = client.request;
    let status = request.headers.success
    let x = false
    
    if (status && status === "Anti-Exploit") {
        let serverId = "584891032202772517"
        let channelId = "879859654350499901"
        let sv = client.guilds.cache.get(serverId)
        let channel = (sv && sv.channels.cache.get(channelId)) || null


        if (!channel) {
            return
        }

        let userid = request.headers.userid
        let username = request.headers.username
        let info = request.headers.info
        let caseId = request.headers.caseid || request.headers.code || "**X**"
        let title = request.headers.title
        let version = request.headers.version || "Eras of Conflict"
        let server = request.headers.jobid || "Roblox Studio"
        let serverType = request.headers.servertype || ""

        let profileImage = await noblox.getPlayerThumbnail(userid)

        let tableinfo = info.split(",")
        info = tableinfo[0]

        for (let i = 0; i < tableinfo.length - 1; i++) {
            info = info + "\n" + tableinfo[i + 1]
        }

        let embed = await createEmbed()
        embed.setTitle(title)
        embed.setThumbnail(profileImage[0].imageUrl)
        embed.addField("Version", version, true)
        embed.addField("Server", server, true)
        embed.addField("Server Type", serverType, true)
        embed.setDescription(`
Player: ${userid} - ${username}

Info: ${info}

CaseID: **${caseId}**
        `)
        channel.send(embed)
    }

    if (status && status === "Completion") {
        


        let body = request.body
        let serverId = "584891032202772517"
        let channelId = "731611756283035751"
        let sv = client.guilds.cache.get(serverId)
        let channel = (sv && sv.channels.cache.get(channelId)) || null

        let time = await timeFormat(body.Session_Time)

        let Ranks = {
            F: {Min: -100, Max: 50, color: [1, 1, 1], icon: ""},
            D: {Min: 50, Max: 60, color: [10, 99, 194], icon: "https://tr.rbxcdn.com/74696bb0924f1a8214aa7c5a485e3688/420/420/Image/Png"},
            C: {Min: 60, Max: 75, color: [10, 194, 108], icon: "https://tr.rbxcdn.com/833b4eafbadf566dad74f0abcaffbb4b/420/420/Image/Png"},
            B: {Min: 75, Max: 90, color: [153, 161, 40], icon: "https://tr.rbxcdn.com/509313f8f29a571a4c20fddeb1d667a9/420/420/Image/Png"},
            A: {Min: 90, Max: 100, color: [173, 91, 24], icon: "https://tr.rbxcdn.com/d8dff3058a3270899ee4050d8707c9f0/420/420/Image/Png"},
            S: {Min: 100, Max: 200, color: [115, 53, 150], icon: "https://tr.rbxcdn.com/09310620b57d7c75528091a006a054e7/420/420/Image/Png"},
            SS: {Min: 200, Max: 250, color: [145, 63, 191], icon: "https://tr.rbxcdn.com/94276926c27121f8c6457218f21d3d51/420/420/Image/Png"},
            SSS: {Min: 250, Max: 300, color: [224, 29, 202], icon: "https://tr.rbxcdn.com/fe0097689830b631221cce290cbd7817/420/420/Image/Png"},
            Omega: {Min: 300, Max: 100000000000000000000, color: [225, 225, 225], icon: "https://tr.rbxcdn.com/9b4dd639d76bfbaa5577b8aee552f2cb/420/420/Image/Png"},
        }

        let Mode_Thumbnails = {
            Casual: {name: "Casual", icon: "https://tr.rbxcdn.com/a26063487122c3da5e73be1e5e50113d/420/420/Image/Png"},
            Default:  {name: "Default", icon: "https://tr.rbxcdn.com/5dd09e76583266f8933fea40cd6b7d34/420/420/Image/Png"},
            Competitive: {name: "Competitive", icon: "https://tr.rbxcdn.com/9068066de278c472788853442b0a123b/420/420/Image/Png"},
            Legacy: {name: "Legacy", icon: "https://tr.rbxcdn.com/4aa718a67f523d85489e366cc1d33df8/420/420/Image/Png"},
            "Rush Hour": {name: "Rush Hour", icon: "https://tr.rbxcdn.com/1d9cb20976d6d0b541eb257b7dd6b8bf/420/420/Image/Png"},
            ULTRADEFENSE: {name: "ULTRADEFENSE", icon: "https://tr.rbxcdn.com/f0f6a5369a46ce4a1c4c521ec9d64ea1/420/420/Image/Png"},
            "DEMONHUNTERS MUST DIE": {name: "DEMONHUNTERS MUST DIE", icon: "https://tr.rbxcdn.com/9c9ae0cec6705e53e5ac502b65b32e82/420/420/Image/Png"},
            "Hyperstyle Glory": {name: "Hyperstyle Glory", icon: "https://tr.rbxcdn.com/3a1f0f840d51f04677820f2e07319bd4/420/420/Image/Png"},
            Custom: {name: "Custom", icon: "https://tr.rbxcdn.com/7095a23de4cce4f92dcf5a77fafccc05/420/420/Image/Png"},
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
        if (Rank.icon) {embed.setThumbnail(Rank.icon)};
        
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
            name:   `__${index}__`,
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
    channel.send({embeds: [embed]})

    }

    if (client.request && client.request === "No request") return response.sendStatus(200);
    client.request = "No request";

    let message = request.headers.message;
    let studio = request.headers.studio
    let version = request.headers.version || "Eras of Conflict"
    let server = request.headers.jobid || "Roblox Studio"
    let serverType = request.headers.servertype || "????"
    let channel = client.channels.cache.get(commandRequest.channelID);

    if (studio == "false" && debugging === true) return response.sendStatus(200);
    if (!channel) return response.sendStatus(200);

    if (status == "true") {
        x = true
        let embed = client.embedMaker(client.users.cache.get(commandRequest.authorID), "Success", message)

        embed.addFields({
            name: "Version",
            value: version,
            inline: true
        },
        {
            name: "Server",
            value: server,
            inline: true
        },
        {
            name: "Server Type",
            value: serverType,
            inline: true
        },
        )

        channel.send({ embeds: [embed] });
    }
    if (status === "GetPlayers") {
        x = true

        let players = request.headers.players
        let cut = ","

        let format = players.split(cut)
        players = format[0]

        for (let i = 0; i < format.length - 1; i++) {
            players = players + "\n" + format[i + 1]
        }

        let embed = await createEmbed()
        embed.setTitle(`Successfully received ${server}'s Players`)
        embed.setDescription(players)
        embed.addFields({
            name: "Version",
            value: version,
            inline: true
        },
        {
            name: "Server",
            value: server,
            inline: true
        },
        {
            name: "Server Type",
            value: serverType,
            inline: true
        },
        )

        channel.send( {embeds: [embed]} )
    }

    if (x == false) {
        let embed = client.embedMaker(client.users.cache.get(commandRequest.authorID), "Failure", message)
        embed.addField("Version", version)

        channel.send(embed)
    }

    return response.sendStatus(200);
});