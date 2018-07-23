const Discord = require('discord.js')
const config = require('../config.json')
const moment = require('moment')
exports.run = (client, message, args) => {
  var actionid = args[0]

  if (actionid === undefined) {
    return message.reply('which action do you want to see?')
  }

  if (isNaN(actionid)) {
    return message.reply("that isn't even a number, you knoblicker.")
  }


  var author = message.author
  console.log(actionid)

  // client.channels.get('360092535219159042').send(`**${author.username}** has requested to see action \`${actionid}\`.`)

  connection.query('SELECT * FROM hypling_actions WHERE action_id ="' + actionid + '"', function (err, result, fields) {
    if (err) throw err
    
    if(!result || result[0] == undefined) {
      return message.reply('I could not find that action.')
    }

    var action = result[0]

    console.log(action)
    var actionAuthor = action.author_id
    var actionAuthorname = client.users.get(actionAuthor).username
    var actionType = action.type
    var actionTarget = action.target
    var actionBalance = action.balance
    // var actionCurrent = Math.sign(actionBalance)
    var actionCreation = parseInt(action.creation_timestamp)
    var actionCreationdate = moment.utc(actionCreation).format('MMMM Do YYYY, HH:mm:ss Z')
    var actionExpiration = parseInt(action.expiration_timestamp)
    var actionExpirationdate = moment.utc(actionExpiration).format('MMMM Do YYYY, HH:mm:ss Z')
    var actionStatus = action.status

    // console.log(actionCreation)
    // console.log(actionCreationdate)

    // var actionStatusMsg = ""

    // if (actionStatus == "ongoing") {
    //   actionStatusMsg = 5
    // }
    // if (actionStatus == "resolved" && actionBalance > 0) {
    //   actionStatusMsg = 1
    // }
    // if (actionStatus == "ongoing" && actionBalance < 1) {
    //   actionStatusMsg = 0 
    // }

    var actionEnd = ""
    
    if (actionExpiration < Date.now()) {
      actionEnd = "Ended   on:"
    } else if (actionExpiration > Date.now()) {
      actionEnd = "Ends    on:"      
    }

    var statusBalance

    if (actionStatus == "ongoing") {
      statusBalance = "Balance:"      
      actionBalance = actionBalance
    } else if (actionStatus == "resolved" && actionBalance < 1) {
      statusBalance = "Status:"
      actionBalance = "'failed'"
    } else if (actionStatus == "resolved" && actionBalance > 0) {
      statusBalance = "Status:"      
      actionBalance = '"passed"'
    }

    message.channel.send(`# Action ${actionid} - ${actionType} "${actionTarget}"\n\n# Author\n${actionAuthorname} - ${actionAuthor}\n\n# ${statusBalance} ${actionBalance}\n\n- Started on: ${actionCreationdate}\n- ${actionEnd} ${actionExpirationdate}.`, {code : "ml"})

  })

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'action',
  description: 'You really need to ask? Gosh you\'re stupid.',
  usage: 'action <ID>'
}
