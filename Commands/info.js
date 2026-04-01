const noblox = require("noblox.js");
const Utils = require("../Utilities/Settings.js");
const { Embed, EmbedBuilder } = require("discord.js");

require('dotenv').config();


module.exports.run = async (interaction, client, args) => {

    let Identification = args.username || toString(args.id)

    if (!Identification) {
        interaction.reply("Please provide a username or ID to fetch information about.")
        return
    }

    let id = null
    

    if (args.username) {
        id = await noblox.getIdFromUsername([args.username5]).catch(
            async () => {
                interaction.reply("Couldn't fetch userID from name, retrying with ID...");
                return
            }
        )
    }

    if (args.id && !args.username) {
        await noblox.getPlayerInfo(args.id).catch(
            async () => {
                interaction.reply("Couldn't fetch userID from ID, retrying with username...");
                return
            }
        )
    }

    if (!id && args.id) {
        id = args.id
    }

    if (!id) return console.log("Couldn't fetch anything from the provided information");

    let profile = await noblox.getPlayerInfo(id)
            .catch((err) => {interaction.reply(`Promise rejected. Couldn't fetch ${Identification}'s information due to an error (${err})`); return})
    
    if (!profile) return
    let thumbnail = await noblox.getPlayerThumbnail(id, 720, "png", false, "Body")

    let groups = await noblox.getGroups(id)
    let embed = new EmbedBuilder()

    let amount = Math.floor(
            groups.length /
            ((groups.length > 0 && groups.length < 5 && 1) || (groups.length >= 5 && groups.length < 10 && 1.5) || (groups.length >= 10 && groups.length < 20 && 2) || (groups.length >= 20 && groups.length < 50 && 5) || (groups.length >= 50 && 10))
        ) || 0
        
        let gs = null

        if (groups.length === 0) {
            gs = "This user is not in any group."
        } else {
            gs = `(**${groups[0].Name}**)`
        }
        
        for (let i = 1; i < Math.floor(amount); i++){
            if (groups[i] && groups[i].Name) {
                gs = gs + `, (**${groups[i].Name}**)`
            }
        }

        let tempText = (
            (groups.length - amount > 0) && `and [${groups.length - amount}] more...`
        ) || ""

        if (thumbnail && thumbnail[0] && thumbnail[0].imageUrl) {
            embed.setThumbnail(thumbnail[0].imageUrl)
        }
        embed.setTitle(`${profile.displayName} (@${profile.username})`)
        embed.setURL(`https://www.roblox.com/users/${id}/profile`)

        embed.addFields(
            {name: "UserId", value: `${id}`, inline: true},
            {name: "Age", value: `${profile.age} days old`, inline: true},
        )
        embed.addFields(
            {name: "--< Description >--", value: profile.blurb || "No description detected."},
            {name: "--< Groups >--", value: `${gs} ${tempText}`}
        )

        embed.setTimestamp()

    
    await interaction.reply({embeds: [embed]})
}

module.exports.help = async () => {
    let name = `**info <username>**`;
    let description = "Gives you the profile details of the said name";
    return `${name} - ${description}\n`;
}