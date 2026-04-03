const { default: axios } = require("axios");
const { json } = require("express");
const adnutrixsettings = require("../utilities/Settings.js")

require("dotenv").config();

module.exports.run = async (interaction, client, args) => {
    let message = args.message

    if (!message) {
        interaction.reply("Please provide a message to send.")
        return
    }

    let universeid = (adnutrixsettings.testing && 2297033956) || 2640653293
    let api_key = process.env.adnutrix_api_key
    let url = `https://apis.roblox.com/messaging-service/v1/universes/${universeid}/topics/Messaging`

    await axios.post(
        url,
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

    interaction.reply("Message sent to all active servers.")
}
