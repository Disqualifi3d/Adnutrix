require("dotenv").config()

const noblox = require("noblox.js")
const express = require("express")
const REST = require("@discordjs/rest")
const Discord = require("discord.js")

const token = process.env.discord_token
const prefix = ";"

const app = express()
app.use(express.json())
const commandList = []

const rest = new REST.REST({version: "10"}).setToken(token)

const Bot = new Discord.Client({intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent
    ],
});


console.log(process.env.key)

// SETUP \\

app.get(`/`, async (r, response) => { // Sends message
    response.status(200).send(Bot.request);
});

let listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is currently listening on port: ${listener.address().port}`);
});

let testing = true

let server = (testing === true && "399221963089772545") || "584891032202772517"

let importantChannels = {
    office: (testing === true && "1361665283340898315") || "620439117431570433",
    modlogs: (testing === true && "1361665283340898315") || "713541389811712001",
    ranks: (testing === true && "1361665283340898315") || "731611756283035751",
    general: (testing === true && "1361665283340898315") || "802324327521452093"
}

Bot.formatTime = async (time) => {
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

// CONNECTIONS \\

Bot.on("ready", async () => {
    let channel = Bot.fetchThisChannel(importantChannels.general)
    channel.send("test")

    Bot.request = "No Request"
})

Bot.on("messageCreate", async message => {

})



// EXTRA CUSTOM BOT FUNCTIONS \\

Bot.fetchThisChannel = (C) => {
    let sv = Bot.guilds.cache.get(server)
    let channel = (sv && sv.channels.cache.get(C)) || null
    if (channel) return channel
}
Bot.login(token)

// MAIN \\

app.post(`/`, async (request, response) => {
    let commandRequest = Bot.request;
    let status = request.headers.success
    let x = false

    return response.sendStatus(200);
});