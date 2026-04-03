require("dotenv").config()
const adnutrixsettings = require("./Settings.js")
const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(process.env.discord_token);
// ...
// for guild-based commands



rest
	.put(Routes.applicationGuildCommands(process.env.client_id, adnutrixsettings.guild), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);
// for global commands
rest
	.put(Routes.applicationCommands(process.env.client_id), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);