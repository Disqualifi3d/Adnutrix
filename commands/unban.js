const { default: axios } = require("axios");
const noblox = require("noblox.js")
const { EmbedBuilder } = require("discord.js")
const profilefetcher = require("../utilities/FetchRobloxProfile.js")
const adnutrixsettings = require("../utilities/Settings.js")

require("dotenv").config();

let isBanned = async (universeid, identifier) => {
    let api_key = process.env.adnutrix_api_key

    return await axios.get(
        `https://apis.roblox.com/cloud/v2/universes/${universeid}/user-restrictions/${identifier}`,
        {
            headers: {
                "x-api-key": api_key,
            },
        }
    ).then((result) => {
        let restriction = result.data.gameJoinRestriction

        if (!restriction?.active) {
            return false
        }

        if (restriction.duration && restriction.startTime) {
            let endTime = Date.parse(restriction.startTime) + parseFloat(restriction.duration) * 1000

            if (endTime <= Date.now()) {
                return false
            }
        }

        return true
    }).catch((err) => {
        if (err.response?.status === 404) {
            return false
        } else {
            throw err
        }
    })
}

let unban = async (interaction, universeid, identifier) => {
    let api_key = process.env.adnutrix_api_key

    const restrictions = {
        gameJoinRestriction: {
            active: false,
        }
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
        }
    ).then(() => {
        return true
    }).catch(async (err) => {
        if (err.response?.status === 429) {
            await interaction.editReply("The Roblox API is currently rate limited. Please try again later within 10 - 30 seconds.")
            return false
        } else {
            throw err
        }
    })
}

module.exports.run = async (interaction, Bot, args) => {

    let reason = args.reason && args.reason.trim()

    if (!reason) {
        await interaction.reply("Please provide a reason for the unban.")
        return
    }

    let serverId = adnutrixsettings.guild
    let channelId = adnutrixsettings.channels.modlogs
    let sv = Bot.guilds.cache.get(serverId)
    let channel = (sv && sv.channels.cache.get(channelId)) || null

    await interaction.deferReply()

    let id = await profilefetcher.fetch(args).catch(() => {
        return null
    })

    if (!id) {
        await interaction.editReply("Couldn't fetch anything from the provided information");
        return
    }

    let profile = await noblox.getUserInfo(id).catch(
        () => {
            return null
        }
    )

    if (!profile) {
        await interaction.editReply("Couldn't fetch anything from the provided information");
        return
    }

    let identifier = id
    let universeid = args.game === "Main" && adnutrixsettings.mainplaceuniverseid || args.game === "Test" && adnutrixsettings.testplaceuniverseid

    if (!universeid) {
        await interaction.editReply("Please choose the Main or Test game for the unban.")
        return
    }

    let banned = await isBanned(universeid, identifier).catch(async (err) => {
        if (err.response?.status === 429) {
            await interaction.editReply("The Roblox API is currently rate limited. Please try again later within 10 - 30 seconds.")
        } else {
            await interaction.editReply(`An error occurred while checking whether this user is banned from the ${args.game} game. Error: ${err.message}`)
        }

        return null
    })

    if (banned === null) {
        return
    }

    if (banned === false) {
        await interaction.editReply(`**${identifier}** is not currently banned from the ${args.game} game.`)
        return
    }

    let unbanResult = await unban(
        interaction,
        universeid,
        identifier
    ).catch(async (err) => {
        await interaction.editReply(`An error occurred while trying to unban this user from the ${args.game} game. Error: ${err.message}`)
        return false;
    })

    if (unbanResult === false) {
        return
    }

    await interaction.editReply(`<@${interaction.member.id}> has unbanned **${identifier}** from the ${args.game} game. \n\n reason: ${reason}`)

    if (!channel) {
        console.log("Couldn't send the unban log")
        return
    }

    let thumbnails = await noblox.getPlayerThumbnail(id, 420, "png", false, "body").catch(() => {
        return []
    })
    let thumbnail = thumbnails[0]?.imageUrl

    let embed = new EmbedBuilder()
    embed.setColor("Green");
    embed.setAuthor({
        name: interaction.member.user.tag,
        iconURL: interaction.member.displayAvatarURL(),
    })

    if (thumbnail) {
        embed.setThumbnail(thumbnail)
    }

    embed.setTitle("Player Unbanned");
    embed.setDescription(
        `[${id} - ${profile.name}](https://www.roblox.com/users/${id}/profile) has been unbanned from the game. \n\n **Reason:** ${reason} \n **Version:** ${args.game} game \n **Moderator responsible:** <@${interaction.member.id}>`
    );
    embed.setTimestamp()

    await channel.send({ embeds: [embed] }).catch(() => {
        console.log(`Couldn't send the unban log for ${identifier}. The player was successfully unbanned.`)
    })
}
