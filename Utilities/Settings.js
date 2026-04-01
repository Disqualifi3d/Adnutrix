const Utils = {
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

Utils.vcChannel = Utils.testing && "399221963089772549" || "802333970943311953"

Utils.guild = Utils.testing && "399221963089772545" || "584891032202772517"

Utils.channels.office = Utils.testing && "1361665283340898315" || "620439117431570433"
Utils.channels.modlogs = Utils.testing && "1361665283340898315" || "713541389811712001"
Utils.channels.ranks = Utils.testing && "1361665283340898315" || "731611756283035751"
Utils.channels.general = Utils.testing && "1361665283340898315" || "802324327521452093"

module.exports = Utils