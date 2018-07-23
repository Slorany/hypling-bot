const moment = require('moment')
exports.run = (client, message, args) => {

  if (!args[0]) {
    return message.reply(`why you aren't telling me who to kick is beyond me.`)
  }

  if (message.mentions.users.size < 1) {
    return message.reply(`I'm going to need a mention there, buddy. I'm a bot, not a magician.`)
  }

  const actionChannel = "459475561631186946"
  
  var author = message.author
  var target = message.mentions.users.first()
  var targetID = target.id
  var actionMsgID = ""
  var actionMsgURL = ""
  var timestampStart = Date.now()
  var dateStart = moment(timestampStart).format('MMMM Do YYYY, h:mm:ss ZZ')
  var timestampEnd = parseInt(timestampStart) + 86400000
  var dateEnd = moment(timestampEnd).format('MMMM Do YYYY, h:mm:ss ZZ')
  // console.log('1529801138149',"\n",timestampStart,"\n",timestampEnd, dateStart, dateEnd)

  if (targetID == '358974767216328707') {
    var kickAuthor = message.guild.members.get(message.author.id)
    // kickAuthor.kick()
    if(kickAuthor.kickable == true) {
      return message.reply(`now everybody knows you're a cretin.`)
    } else {
      return message.reply(`PLEASE DON'T! I'LL DO ANYTHING! ANYTHING YOU WANT!`)
    }
    // return message.author.member.kick()
  }
  
    // check points
    connection.query('SELECT points FROM hypling_users where id="' + author.id + '"' , function (err, result, fields) {
      var points = parseInt(result[0].points)
      console.log(points)
      if (points < 1 || points == 0 || isNaN(points) || points == null || points == undefined) {
        points = 0
        return message.reply(`you do not have enough points to do that. You currently have ${points}.`)
      } else {
        
        // execute action
        client.channels.get(actionChannel).send(`${author.username} (${author.id}) has started a vote to kick \`${target.username}\``).then(
          setTimeout(function () {
            actionMsgID = client.channels.get(actionChannel).lastMessage.id
            actionMsgURL = `https://discordapp.com/channels/294063593819865088/459475561631186946/${actionMsgID}`
            message.channel.send(`Your request \`${actionMsgID}\` has been created at <${actionMsgURL}>, in <#${actionChannel}>.`)
            setTimeout(function () {
              client.channels.get('459475561631186946').fetchMessage(actionMsgID).then(
                message => message.edit(`# Action ${actionMsgID} - kick "${target.username}"\n\n# Author\n${author.username} - ${author.id}\n\n# Balance: 1\n\n- Started on: ${dateStart}\n- Ends on: ${dateEnd}.`, {code : "ml"})
              )
  
              connection.query('INSERT INTO hypling_actions VALUES ("' + actionMsgID + '","' + author.id + '","kick","'+ target.id + '","1","' + timestampStart + '","' + timestampEnd + '","ongoing","")', function (err, result, fields) {
                if (err) throw err
                
                // take points away from user
                var newPoints = points - 1
    
                connection.query('UPDATE hypling_users SET points="' + newPoints + '" WHERE id="' + author.id + '"', function (err, result, fields) {
                  if (err) throw err
                  message.reply(`you now have ${newPoints} points left.`)
                })
              })
            }, 500)
          }
          , 1000)
        )
      } 
    })

  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'kick',
  description: 'Creates a request to kick someone.',
  usage: 'kick <mention>'
};
