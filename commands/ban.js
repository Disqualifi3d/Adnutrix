const { default: axios } = require("axios");
const noblox = require("noblox.js")
const {Client, Embed, EmbedBuilder, AttachmentBuilder } = require("discord.js")
const profilefetcher = require("../utilities/FetchRobloxProfile.js")
const adnutrixsettings = require("../utilities/Settings.js")

require("dotenv").config();

let wait = async (time) => {
    let started = Date.now()

    await new Promise((resolve) => {
        setTimeout(resolve, time * 1000)
    })

    return (Date.now() - started) / 1000
}

let ban = async (interaction, universeid, identifier, reasons, duration) => {
    let api_key = process.env.adnutrix_api_key

    console.log("Yea")

    const restrictions = {
                gameJoinRestriction: {
                active: true,
			    displayReason: reasons.display,
			    privateReason: reasons.private,
			    excludeAltAccounts: false,
            }
    }

    if (duration && duration > 0) {
        restrictions.gameJoinRestriction.duration = `${duration}s`
    }

    return await axios.patch(
        `https://apis.roblox.com/cloud/v2/universes/${universeid}/user-restrictions/${identifier}`, 
        restrictions,
        {
		    headers: {
		    	"x-api-key": api_key,
		    	"Content-Type": "application/json",
		    },
		    params: {
		    	updateMask: "gameJoinRestriction",
		    },
	}).then(() => {
        return true
    }).catch((err) => {
        if (err.response?.status === 429) {
            interaction.reply("The Roblox API is currently rate limited. Please try again later within 10 - 30 seconds.")
            return false
        } else {
            throw err
        }
    })
}

module.exports.run = async (interaction, Bot, args) => {

    if (!args.reasons) {
        interaction.reply("Please provide a reason for the ban.")
        return
    }

    let serverId = adnutrixsettings.guild
    let channelId = adnutrixsettings.channels.modlogs
    let sv = Bot.guilds.cache.get(serverId)
    let channel = (sv && sv.channels.cache.get(channelId)) || null
    
    let id = await profilefetcher.fetch(args)

    if (!id) {
        interaction.reply("Couldn't fetch anything from the provided information");
        return
    }

    let profile = await noblox.getPlayerInfo(id).catch(
        (err) => {
            interaction.reply(`Promise rejected. Couldn't fetch ${id}'s information due to an error (${err})`); 
            return
        }
    )

    if (!profile) {
        interaction.reply("Couldn't fetch anything from the provided information");
        return
    }

    let identifier = id
    let reasons = args.reasons
    let duration = args.duration
    let universeid = args.game === "Main" && adnutrixsettings.mainplaceuniverseid || args.game === "Test" && adnutrixsettings.testplaceuniverseid

    if (duration > 633398400) {
        interaction.reply("The maximum duration for a ban is 7331 days (633398400 seconds). Please provide a shorter duration or permanently ban the player.")
        return
    }

    let api_key = process.env.adnutrix_api_key

    let mainBanResult = await ban(
        interaction,
        universeid,
        identifier,
        reasons,
        duration
    ).catch((err) => {
        interaction.reply(`An error occurred while trying to ban this user from the main game. Error: ${err}`)
        return false;
    })

    if (mainBanResult === false) {
        return
    }

    //await wait(1)
    
    try {
        axios.post(
            `https://apis.roblox.com/messaging-service/v1/universes/${universeid}/topics/Kicking`,
            {
                message: JSON.stringify({
                    Identifier: identifier,
                    Reason: reasons.display,
                    Ban: true
                })
            },
            {
                headers: {
                    "x-api-key": api_key,
                    "Content-Type": "application/json"
                }
            }
        )
    } catch (err) {
        console.log("Messaging POST failed")
        console.log("Status:", err.response?.status)
        console.log("Data:", err.response?.data)
        throw err
    }

    interaction.reply(`<@${interaction.member.id}> has banned **${identifier}** \n\n reason: ${reasons.display}`)

    let formattedDuration = await adnutrixsettings.formatTime(duration)

    let thumbnails = await noblox.getPlayerThumbnail(id, 420, "png", false, "body")
    let thumbnail = thumbnails[0]?.imageUrl

    let embed = new EmbedBuilder()
    embed.setColor("Red");
    embed.setAuthor({
        name: interaction.member.user.tag,
        iconURL: interaction.member.displayAvatarURL(),
    })
    embed.setThumbnail(thumbnail)
    embed.setTitle("Player Banned");
    embed.setDescription(
        `[${id} - ${profile.username}](https://www.roblox.com/users/${id}/profile) has been banned from the game. \n\n **Reason:** ${reasons.private} \n **Version:** ${args.game} game \n **Duration:** ${(duration > 0 && formattedDuration) || "Permanent"} \n **Moderator responsible:** <@${interaction.member.id}>`
    );
    embed.setTimestamp()

    await channel.send({ embeds: [embed] })

    
}