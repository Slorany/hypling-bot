const Discord = require('discord.js')
const moment = require('moment')
exports.run = (client, message, args) => {

  var author = message.author

  connection.query('SELECT * FROM hypling_actions WHERE status="ongoing"', function (err, result, fields) {
    if (err) throw err
    var actions = result
    console.log(actions.length)

    if (actions.length == 0) {
      message.reply('there are 0 ongoing actions.')
    } 

    for (i = 0; i < actions.length; i++) {
      // console.log(result[i])
      var action_id = result[i].action_id
      var author_id = result[i].author_id
      var author_name = client.users.get(author_id).username
      var type = result[i].type
      var target = result[i].target
      var balance = result[i].balance
      var creation_timestamp = result[i].creation_timestamp
      var creationDate = moment.utc(+creation_timestamp).format('MMMM Do YYYY, HH:mm:ss')
      var expiration_timestamp = result[i].expiration_timestamp
      var expirationDate = moment.utc(+expiration_timestamp).format('MMMM Do YYYY, HH:mm:ss')
      var status = result[i].status
      
      var actions_full = `${action_id} (${type} ${target}) created by ${author_name} on ${creationDate}, expiring on ${expirationDate}. Balance: ${balance}. Status: ${status}.`
      
      console.log(actions_full)
      
      message.author.send(actions_full, {code : "xl"})
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
  name: 'actions',
  description: 'You really need to ask? Gosh you\'re stupid.',
  usage: 'actions'
}
