const Discord = require('discord.js')
const Mexp = require('math-expression-evaluator')

const bot = new Discord.Client()
const config = bot.config = require('dotenv').config().parsed

const mappedResponses = {
    42: 'Life',
    666: ':smiling_imp:',
    me: msg => msg.author
}

const latestAnswers = {}

function getResponse(msg, input) {
    var handler = mappedResponses[input]
    if (!handler) {
        return input
    }

    if (typeof handler === 'function') {
        return handler(msg)
    }
    return handler.toString()
}

bot.on('ready', () => {
    bot.user.setAvatar('./avatar.png')
    bot.user.setGame(`${config.prefix}calc`)

    console.log('CalculatorBot v2 is ready to go! Invite me to a server:')
    console.log(`https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&permissions=11264&scope=bot`)
})

bot.on('message', msg => {
    if (msg.author.bot || !msg.content.startsWith(config.prefix)) {
        return
    }

    let content = msg.content.substr(config.prefix.length).trim()
    let command = content.split(' ')[0]
    let args = content.split(' ').slice(1)

    if (/^calc(ulate)?$/.test(command)) {
        try {
            var input = args.join(' ')
            var output = getResponse(msg, input)
            if (output === input) {
                if (latestAnswers[msg.author.id] !== undefined) {
                    input = input.replace(/ans(wer)?/gi, latestAnswers[msg.author.id])
                }
                output = getResponse(msg, Mexp.eval(input))
                latestAnswers[msg.author.id] = output
            }

            msg.channel.sendMessage(`:crystal_ball: __${output}__`)
        } catch (err) {
            msg.channel.sendMessage(`:x: \`${err.message || err}\``).then(m => m.delete(5000))
        }
    } else if (command === 'ping') {
        msg.channel.sendMessage('Ping!').then(m => m.edit(`:stopwatch: Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``))
    }
})

bot.login(config.token)