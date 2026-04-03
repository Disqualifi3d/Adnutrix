const { default: axios } = require("axios");
const { json } = require("express");
const adnutrixsettings = require("../utilities/Settings.js");
const Settings = require("../utilities/Settings.js");

require("dotenv").config();

module.exports.run = async (interaction, client, args) => {
    let message = args.message

    if (!message) {
        interaction.reply("Please provide a message to send.")
        return
    }

    let api_key = process.env.adnutrix_api_key

    await axios.post(
        `https://apis.roblox.com/messaging-service/v1/universes/${adnutrixsettings.mainplaceuniverseid}/topics/Messaging`,
        {
            message: JSON.stringify({
                Text: message,
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
            `https://apis.roblox.com/messaging-service/v1/universes/${adnutrixsettings.testplaceuniverseid}/topics/Messaging`,
            {
                message: JSON.stringify({
                    Text: message,
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

    interaction.reply("Message sent to all active servers.")
}
