const Utils = {
    testing: true,

    guilds: "",
    channels: {},
}

Utils.guild = Utils.testing && "399221963089772545" || "584891032202772517"

Utils.channels.office = Utils.testing && "1361665283340898315" || "620439117431570433"
Utils.channels.modlogs = Utils.testing && "1361665283340898315" || "713541389811712001"
Utils.channels.ranks = Utils.testing && "1361665283340898315" || "731611756283035751"
Utils.channels.general = Utils.testing && "1361665283340898315" || "802324327521452093"

module.exports = Utils