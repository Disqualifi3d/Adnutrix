const Settings = {
    testing: true,

    formatTime: async (time) => {
        let hours = Math.floor(time / (60 * 60))
        let minutes = Math.floor(time / 60) % 60
        let seconds = Math.floor(time) % 60

        if (hours > 0) {
            hours = `${hours}h`
        } else if (hours <= 0) {
            hours = ""
        }

        return (`${hours} ${minutes}m ${seconds}s`)
    },

    guild: "",
    channels: {},

    vcChannel: ""
}

Settings.mainplaceuniverseid = Settings.testing && "2297033956" || "2640653293"
Settings.testplaceuniverseid = Settings.testing && "2297033956" || "3464172496"

Settings.vcChannel = Settings.testing && "399221963089772549" || "802333970943311953"

Settings.guild = Settings.testing && "399221963089772545" || "584891032202772517"

Settings.channels.office = Settings.testing && "1361665283340898315" || "620439117431570433"
Settings.channels.modlogs = Settings.testing && "1361665283340898315" || "713541389811712001"
Settings.channels.ranks = Settings.testing && "1361665283340898315" || "731611756283035751"
Settings.channels.general = Settings.testing && "1361665283340898315" || "802324327521452093"

module.exports = Settings