const moment = require('moment')
exports.run = (client, message, args) => {

  if (!args[0]) {
    return message.reply('and who shall I invite, you incompetent knoblicker?')
  }
  
  const actionChannel = "459475561631186946"

  var author = message.author
  var target = args.join(' ').replace('"','').replace("'","")
  var actionMsgID = ""
  var actionMsgURL = ""
  var timestampStart = Date.now()
  var dateStart = moment(timestampStart).format('MMMM Do YYYY, HH:mm:ss ZZ')
  var timestampEnd = parseInt(timestampStart) + 86400000
  var dateEnd = moment(timestampEnd).format('MMMM Do YYYY, HH:mm:ss ZZ')
  // console.log('1529801138149', "\n",timestampStart, "\n",timestampEnd, dateStart, dateEnd)
  
  // check points
  connection.query('SELECT points FROM hypling_users where id="' + author.id + '"' , function (err, result, fields) {
    var points = parseInt(result[0].points)
    console.log(points)
    if (points < 1 || points == 0 || isNaN(points) || points == null || points == undefined) {
      points = 0
      return message.reply(`you do not have enough points to do that. You currently have ${points}.`)
    } else {
      // execute action

      client.channels.get(actionChannel).send(`${author.username} (${author.id}) has started a vote to invite \`${target}\``).then(
        setTimeout(function () {
          actionMsgID = client.channels.get(actionChannel).lastMessage.id
          actionMsgURL = `https://discordapp.com/channels/294063593819865088/459475561631186946/${actionMsgID}`
          message.channel.send(`Your request \`${actionMsgID}\` has been created at <${actionMsgURL}>, in <#${actionChannel}>.`)
          setTimeout(function () {
            client.channels.get('459475561631186946').fetchMessage(actionMsgID).then(
              message => message.edit(`# Action ${actionMsgID} - invite "${target}"\n\n# Author\n${author.username} - ${author.id}\n\n# Balance: 1\n\n- Started on: ${dateStart}\n- Ends on: ${dateEnd}.`, {code : "ml"})
            )

            connection.query('INSERT INTO hypling_actions VALUES ("' + actionMsgID + '","' + author.id + '","invite","'+ target + '","1","' + timestampStart + '","' + timestampEnd + '","ongoing","")', function (err, result, fields) {
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
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'invite',
  description: 'Creates a request to invite someone.',
  usage: 'invite <name>'
}
