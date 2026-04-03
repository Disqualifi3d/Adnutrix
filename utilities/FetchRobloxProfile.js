const noblox = require("noblox.js")


module.exports.fetch = async(args) => {
    let identifer = args.username || toString(args.id)

    if (!identifer) {
        return null
    }

    let id = null

    if (args.username) {
        id = await noblox.getIdFromUsername([args.username])

        if (!id) {
            console.log("Couldn't fetch P1")
        }
    }

    if (!id && args.id) {
        let inf = await noblox.getPlayerInfo(args.id).catch(
            () => {
                console.log("invalid id")
                return null
            }
        )

        if (!inf) {
            console.log("Couldn't fetch P2")
        } else {
            id = args.id
        }
    }

    return id
}