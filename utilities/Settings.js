const Settings = {
    testing: false,

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

    vcChannel: "",


    rankimages: {
            F: { Min: -100, Max: 50, color: [1, 1, 1], icon:                                           "./images/modes/meowl.png" },
            D: { Min: 50, Max: 60, color: [10, 99, 194], icon:                                         "./images/modes/meowl.png" },
            C: { Min: 60, Max: 75, color: [10, 194, 108], icon:                                        "./images/modes/meowl.png" },
            B: { Min: 75, Max: 90, color: [153, 161, 40], icon:                                        "./images/modes/meowl.png" },
            A: { Min: 90, Max: 100, color: [173, 91, 24], icon:                                        "./images/modes/meowl.png" },
            S: { Min: 100, Max: 200, color: [115, 53, 150], icon:                                      "./images/modes/meowl.png" },
            SS: { Min: 200, Max: 250, color: [145, 63, 191], icon:                                     "./images/modes/meowl.png" },
            SSS: { Min: 250, Max: 300, color: [224, 29, 202], icon:                                    "./images/modes/meowl.png" },
            Omega: { Min: 300, Max: 100000000000000000000, color: [225, 225, 225], icon:               "./images/modes/meowl.png" },
        },

    modeimages: {
            Casual: { name: "Casual", icon:                                                            "./images/modes/meowl.png" },
            Default: { name: "Default", icon:                                                          "./images/modes/meowl.png" },
            Competitive: { name: "Competitive", icon:                                                  "./images/modes/meowl.png" },
            Legacy: { name: "Legacy", icon:                                                            "./images/modes/meowl.png" },
            "Rush Hour": { name: "Rush Hour", icon:                                                    "./images/modes/meowl.png" },
            ULTRADEFENSE: { name: "ULTRADEFENSE", icon:                                                "./images/modes/meowl.png" },
            "DEMONHUNTERS MUST DIE": { name: "DEMONHUNTERS MUST DIE", icon:                            "./images/modes/meowl.png" },
            "Hyperstyle Glory": { name: "Hyperstyle Glory", icon:                                      "./images/modes/meowl.png" },
            Custom: { name: "Custom", icon:                                                            "./images/modes/meowl.png" },
        },
}

Settings.mainplaceuniverseid = Settings.testing && "2297033956" || "2640653293"
Settings.testplaceuniverseid = Settings.testing && "2297033956" || "3464172496"

Settings.vcChannel = Settings.testing && "399221963089772549" || "802333970943311953"

Settings.guild = Settings.testing && "399221963089772545" || "584891032202772517"

Settings.channels.office = Settings.testing && "1361665283340898315" || "620439117431570433"
Settings.channels.modlogs = Settings.testing && "1361665283340898315" || "713541389811712001"
Settings.channels.ranks = Settings.testing && "1489472347772817530" || "731611756283035751"
Settings.channels.general = Settings.testing && "1361665283340898315" || "802324327521452093"

module.exports = Settings