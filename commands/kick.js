const { default: axios } = require("axios");
const noblox = require("noblox.js")
const profilefetcher = require("../utilities/FetchRobloxProfile.js")
const adnutrixsettings = require("../utilities/Settings.js")

require("dotenv").config();

module.exports.run = async (interaction, client, args) => {

    if (!args.reason) {
        interaction.reply("Please provide a reason for the kick.")
        return
    }

    let id = await profilefetcher.fetch(args)

    if (!id) {
        interaction.reply("Couldn't fetch anything from the provided information");
        return
    }

    let profile = await noblox.getPlayerInfo(id).catch(
        (err) => {
            interaction.reply(`Promise rejected. Couldn't fetch ${Identification}'s information due to an error (${err})`); 
            return
        }
    )

    if (!profile) {
        interaction.reply("Couldn't fetch anything from the provided information");
        return
    }

    let identifier = profile.username
    let reason = args.reason

    let api_key = process.env.adnutrix_api_key

    await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${adnutrixsettings.mainplaceuniverseid}/topics/Kicking`,
        {
            message: JSON.stringify({
                Identifier: identifier,
                Reason: reason
            })
        },
        {
            headers: {
                "x-api-key": api_key,
                "Content-Type": "application/json"
            }
        }
    )

    if (adnutrixsettings.testing === false) {
    await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${adnutrixsettings.testplaceuniverseid}/topics/Kicking`,
        {
            message: JSON.stringify({
                Identifier: identifier,
                Reason: reason
            })
        },
        {
            headers: {
                "x-api-key": api_key,
                "Content-Type": "application/json"
            }
        }
    )
}

    interaction.reply(`<@${interaction.member.id}> initiated a kick request for **${identifier}** \n\n reason: ${reason}`)
}