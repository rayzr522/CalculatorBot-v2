const Discord = require('discord.js')
const Mexp = require('math-expression-evaluator')

const bot = new Discord.Client()
const config = bot.config = require('dotenv').config().parsed

bot.on('ready', () => {
    bot.user.setAvatar('./avatar.png')
    bot.user.setGame(`${config.prefix}calc`)

    console.log('CalculatorBot v2 is ready to go! Invite me to a server:')
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&permissions=11264&scope=bot`)
})

bot.on('message', msg => {
    if (msg.author.bot) {
        return
    }

    let content = msg.content.substr(config.prefix.length).trim()
    let command = content.split(' ')[0]
    let args = content.split(' ').slice(1)

    if (/^calc(ulate)?$/.test(command)) {
        try {
            msg.reply(Mexp.eval(args.join(' ')))
        } catch (err) {
            msg.channel.sendMessage(`:x: ${err.message || err}`).then(m => m.delete(5000))
        }
    } else if (command === 'ping') {
        msg.channel.sendMessage('Ping!').then(m => m.edit(`:stopwatch: Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``))
    }
})

bot.login(config.token)