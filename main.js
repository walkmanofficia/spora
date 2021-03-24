const Discord   = require('discord.js');
const fs        = require('fs');
//  Другие константы
const database  = require('./database');
const commands  = {}; //  Читай верх


const bot = new Discord.Client(); // Создание бота

bot.login("NzYxMjA5MjM4OTY1MDU5NTg0.X3XRWQ.yTOrli39BkIn7WRcuIlch1BlDDw"); // Логин

// Функции
function loadCommands(path) {
	console.log('loading commands...');
	const files = fs.readdirSync(path).filter(f => f.endsWith('.js'));
	files.forEach(file => {
		const cname = file.toLowerCase().substring(0, file.length-3);
		const command = require(path + '/' + file);
		commands[cname] = command;
		console.log(`* ${file} loaded`);
	});

	console.log('commands successfully loaded');
}


//  КОД


bot.on('ready', () => {
	console.log('successfully logged in discord!');
	database.load('./database.json');
	loadCommands('./commands');
});

process.on("SIGINT", () => {
	console.log('closing...');
	bot.destroy();
	database.save('./database.json');
});
bot.on('message', msg => {
	if (msg.author.bot || msg.channel.type != "text") return;
	database.getAccount(msg.member).message++;
	

	let prefix = database.getGuildData(msg.guild).prefix;
	if (msg.content.toLowerCase().startsWith(prefix)) {
		let m = msg.content.slice(prefix.length);
		for (let cname in commands) {
			if (m.startsWith(cname)) {
				let args = m.slice(cname.length).split(' ').filter(Boolean);
				commands[cname].run(bot, msg, args, database);
			}
		}
	}
});
