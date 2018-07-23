const Discord = require('discord.js')
const config = require('../config.json')
module.exports = message => {
  var prefix = config.prefix
  let client = message.client
  if (message.channel.type != 'text') return
  if (!message.content.startsWith(prefix)) return
  if (message.author.bot) return
  if (message.guild.id != '294063593819865088') return

  let command = message.content.split(' ')[0].slice(config.prefix.length)
  let params = message.content.split(' ').slice(1)
  let perms = client.elevation(message)

  let cmd
  if (client.commands.has(command)) {
    cmd = client.commands.get(command)
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command))
  }
  if (cmd) {
    var d = new Date().toISOString().replace('T', ' ').substr(0, 19)
    var user = {
      id: message.author.id,
      name: message.author.username,
      discriminator: message.author.discriminator
    }

    var place = {
      guild: message.guild.name,
      guildID: message.guild.id,
      channel: message.channel.name,
      channelID: message.channel.id
    }

    var cmdLog = {
      name: cmd.help.name,
      args: params.join(' - ')
    }

    // console.log(params)
    // console.log(cmdLog.args)

    if (cmdLog.args === '') {
      cmdLog.args = 'none'
    }

    var permission
    if (perms > cmd.conf.permLevel) {
      permission = 'Yes'
    } else {
      permission = 'No'
    }

    // const Embed = new Discord.RichEmbed()
    // .setTitle(``)
    // .setColor(randomColour(16777215))
    // .setTimestamp()
    // .addField(`${place.guild} — #${place.channel}`, `${place.guildID} — ${place.channelID}\n(<#${place.channelID}>)`)        
    // .addField(`Author`, `${user.name}#${user.discriminator}\nID: ${user.id}\n<@${user.id}> `)    
    // .addField(`Command`, `${cmdLog.name}`)
    // .addField(`Arguments`, `${cmdLog.args}`);

    // client.channels.get('457927131297742848').send(Embed)

    var permLog
    if (permission === 'Yes') {
      permLog = ''
    } else {
      permLog = 'not '
    }

    var log = `${d} — ${user.name} (${user.id}) on the server ${place.guild} (${place.guildID}) on the channel #${place.channel} (${place.channelID}) tried to execute: ${cmdLog.name} ${cmdLog.args}`
    
    // user.name + "ID: " + user.id + ") on " + message.guild.name + "/#" + message.channel.name + "(" + message.guild.id + "/" + message.channel.id
    // var logCommand = cmd.help.name + "' with arguments: '" + params.join(" ") + "'"
    if (perms < cmd.conf.permLevel) return message.reply('you don\'t have the permissions to execute this command.')

    console.log(log)

    cmd.run(client, message, params, perms)
  }

  function randomColour(max) {
    var ret;
    ret = Math.floor(Math.random() * max)+1;
    return ret;
  }
}
