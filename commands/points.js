exports.run = (client, message, args) => {
  var user

  if (message.mentions.users.size < 1) {
    user = message.author
  } else {
    user = message.mentions.users.first()
  }

  // console.log(userid)

  checkPoints()

  function checkPoints () {
    connection.query('SELECT id FROM hypling_users WHERE id = "' + user.id + '"', function (err, result, fields) {
      if (err) throw err
      var checkUser = result[0]
      if (checkUser === undefined) {
        return message.channel.send(`**${user.username}** has not yet been dropped points.`)
      } else {
        connection.query('SELECT points FROM hypling_users where id = "' + user.id + '"', function (err, result, fields) {
          var points = parseInt(result[0].points)

          if (isNaN(points) || points == null || points == undefined) {
            return message.channel.send(`**${user.username}** has 0 points.`)            
          }
          // console.log(points)
          return message.channel.send(`**${user.username}** has ${points} points.`)
        })
      }
      return
    })
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['p'],
  permLevel: 0
}

exports.help = {
  name: 'points',
  description: 'Check how many points a user has.',
  usage: 'points [<mention>]'
}
