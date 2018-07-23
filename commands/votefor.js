const moment = require('moment')
exports.run = (client, message, args) => {
  var action = args[0]
  var timestampNow = Date.now()
  var dateNow = moment(timestampNow).format('MMMM Do YYYY, h:mm:ss Z')
  console.log(action)

  if (!action) {
    return message.reply('you just voted for air guitar, I guess.')
  }

  connection.query('SELECT points FROM hypling_users WHERE id="' + message.author.id + '"', function (err, result, fields) {
    if (err) throw err
    var userPoints = parseInt(result[0].points)
    console.log(userPoints)
    if (!userPoints || userPoints == 0 || userPoints == undefined || userPoints == null || isNaN(userPoints)) {
      return message.reply('you do not have enough points.')
    }
    
    connection.query('SELECT * FROM hypling_actions WHERE action_id="' + action + '"', function (err, result, fields) {
      if (err) throw err
      if (!result[0]) {
        return message.reply('this action does not exist.')
      } else {
        console.log(result)
        var actionid = result[0].action_id
        var author = client.users.get(result[0].author_id)
        var type = result[0].type
        var target = result[0].target
        var balance = result[0].balance
        var status = result[0].status
        var voters = result[0].voters
        var actionCreation = parseInt(result[0].creation_timestamp)
        var dateStart = moment.utc(actionCreation).format('MMMM Do YYYY, HH:mm:ss Z')
        var actionExpiration = parseInt(result[0].expiration_timestamp)
        var dateEnd = moment.utc(actionExpiration).format('MMMM Do YYYY, HH:mm:ss Z')
        
        // console.log(actionid, author, type, target, balance, expiration, status)
        if (status !== "ongoing") {
          return message.reply('this action has already expired.')
        } else {
          var newBalance = parseInt(balance) + 1
          connection.query('UPDATE hypling_actions SET balance="' + newBalance + '" WHERE action_id="' + actionid + '"', function (err, result, fields) {
            if (err) throw err
            client.channels.get('459475561631186946').fetchMessage(actionid).then(
              message => message.edit(`# Action ${actionid} - ${type} "${target}"\n\n# Author\n${author.username} - ${author.id}\n\n# Balance: ${newBalance}\n\n- Started on: ${dateStart}\n- Ends on: ${dateEnd}.`, {code : "ml"})
            )
            connection.query('SELECT points FROM hypling_users where id="' + message.author.id + '"', function (err, result, fields) {
              if (err) throw err
              var points = parseInt(result[0].points)
              var newPoints = points - 1
              connection.query('UPDATE hypling_users SET points="' + newPoints + '" WHERE id="' + message.author.id + '"', function (err, result, fields) {
                if (err) throw err
                message.reply(`you now have ${newPoints} points left.`).then(
                  client.channels.get('360092535219159042').send(`**${message.author.username}** (${message.author.id}) has voted **for** action \`${actionid}\`: \`${type} ${target}.\``)
                )
              })
            })
          })
        }
      }
    })
  })
}
  
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['yay', 'yea', 'support'],
  permLevel: 0
};

exports.help = {
  name: 'votefor',
  description: 'Adds one point to the balance of an action',
  usage: 'votefor <actionID>'
};
