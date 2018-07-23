const moment = require('moment')
module.exports = client => {
  
  // var servernames = client.guilds.map(guild => guild.name)
  console.log("I am ready and connected to " + client.guilds.array().length + " servers.")
  // client.channels.get('457927131297742848').send(`I am ready and connected to + ${client.guilds.array().length} + servers:`)
  // client.channels.get('457927131297742848').send(servernames)

  setInterval (
    function check_actions () {
    connection.query('SELECT * FROM hypling_actions WHERE status="ongoing"', function (err, result, fields) {
      if (err) throw err
      let datenow = Date.now()
      // console.log(`Timestamp_now: ${datenow} `)
      // console.log(result)
      // console.log(result.length)
      // foreach loop running on each occurence and comparing the timestamps. 
      // If timenow > timeexpiration => check balance
      // If Balance >= 1 => action success (post result, send 1 use invite to action author)
      // If balance < 1 => action failure
      
      for (i = 0; i < result.length; i++) {
        // console.log(datenow, parseInt(result[i].expiration_timestamp))
        // Store variables
        var actionid = result[i].action_id
        var balance = result[i].balance
        var authorid = result[i].author_id
        var actionType = result[i].type
        var author = client.users.get(authorid)
        var creation = parseInt(result[0].creation_timestamp)
        var dateStart = moment.utc(creation).format('MMMM Do YYYY, HH:mm:ss ZZ')
        var expiration = parseInt(result[i].expiration_timestamp)
        var dateEnd = moment.utc(expiration).format('MMMM Do YYYY, HH:mm:ss ZZ')
        var target = result[i].target

        var statusBalance

        if (datenow > parseInt(expiration)) {
          console.log(result[i].action_id, "has expired.")   

          // handle invite type actions

          if (actionType == "invite") {
          // Edit action in DB
            connection.query('UPDATE hypling_actions SET status="resolved" WHERE action_id="' + actionid + '"', function (err, result, fields) {
              if (err) throw err
              // check balance for resolution
              if (balance >= 1) {
                statusBalance = 'Status: "passed"'
                // Fetch and edit action message (Author, action_id, final balance)
                client.channels.get('459475561631186946').fetchMessage(actionid).then(
                  message => message.edit(`# Action ${actionid} - ${actionType} "${target}"\n\n# Author\n${author.username} - ${author.id}\n\n# ${statusBalance}\n\n- Started on: ${dateStart}\n- Ended on: ${dateEnd}.`, {code : "ml"})
                    // `${author.username} (${author.id}) started a vote to invite \`${target}\`\nBalance: \`${balance}\`.\nThis action, \`${actionid}\`, has passed.`)
                    .then(
                  // Create and send 1 use never-expiring invite to author
                    client.channels.get('294063593819865088').createInvite({unique: true, maxUses: 1}).then(invite => author.send(`Your action ${actionid} has resolved with a balance of \`${balance}\`. Please send this invite to \`${target}\`: discord.gg/${invite.code}.`))
                    // .catch(
                      // on failure to deliver, send to Slorany (idk why that doesn't work only on an error, it triggers every time wtf)
                      // client.users.get('176793254447022081').send(`I could not send the invite to ${author.username}#${author.discriminator}. Please ensure it is sent to ${target}.`)
                    // )
                ))
              } else if (balance < 1) {
                statusBalance = "Status: 'failed'"
                client.channels.get('459475561631186946').fetchMessage(actionid).then(
                  message => message.edit(`# Action ${actionid} - ${actionType} "${target}"\n\n# Author\n${author.username} - ${author.id}\n\n# ${statusBalance}\n\n- Started on: ${dateStart}\n- Ended on: ${dateEnd}.`, {code : "ml"})
                )
              }
            }) 
          // handle kick type actions

          } else if (actionType == "kick") {
            console.log('TARGET:', parseInt(target))
            var targetGuild  = client.guilds.get('294063593819865088')
            console.log('GUILD:', targetGuild.id)
            var targerUser = client.users.get('target')
            var targetMember = targetGuild.members.get(target)
            console.log('MEMBER', targetMember)            
            if (!targetMember || targetMember == undefined) {
              break 
              console.log(`possible problem with ${targerUser.id} ${targerUser.name}.`)
            }
            // if balance is negative, fail

            if (balance < 1) {
              statusBalance = "Status: 'failed'"
              connection.query(`UPDATE hypling_actions SET status="resolved" WHERE action_id="${actionid}"`, function (err, result, fields) {
                if (err) throw err
                client.channels.get('459475561631186946').fetchMessage(actionid).then(
                  message => message.edit(`# Action ${actionid} - ${actionType} "${targetMember.username}"\n\n# Author\n${author.username} - ${author.id}\n\n# ${statusBalance}\n\n- Started on: ${dateStart}\n- Ended on: ${dateEnd}.`, {code : "ml"})
                )
              })
            } else {
              // if balance is positive, check against target's points
              // get target points
              connection.query(`SELECT points FROM hypling_users WHERE id="${target}"`, function (err, result, fields) {
                if (err) throw err
                var targetPoints = parseInt(result[0].points)
      
                // if (targetPoints - balance) >= 0, don't kick and substract balance from targetPoints
                if ((targetPoints - balance) >= 0) {
                  statusBalance = "Status: 'failed'"
                  var newTargetPoints = targetPoints - balance
                  connection.query(`UPDATE hypling_users SET points=${newTargetPoints} WHERE id="${target}"`, function (err, result, fields) {
                    if (err) throw err

                    connection.query(`UPDATE hypling_actions SET status="resolved" WHERE action_id="${actionid}"`, function (err, result, fields) {
                      if (err) throw err
                      client.channels.get('459475561631186946').fetchMessage(actionid).then(
                        message => message.edit(`# Action ${actionid} - ${actionType} "${targetMember.username}"\n\n# Author\n${author.username} - ${author.id}\n\n# ${statusBalance}\n\n- Started on: ${dateStart}\n- Ended on: ${dateEnd}.`, {code : "ml"})
                      )
                    })
                  })
                } else if ((targetPoints - balance) < 0) {
                  statusBalance = 'Status: "failed"'

                  targetMember.kick()
                  client.channels.get('459475561631186946').fetchMessage(actionid).then(
                    message => message.edit(`# Action ${actionid} - ${actionType} "${targetMember.username}"\n\n# Author\n${author.username} - ${author.id}\n\n# ${statusBalance}\n\n- Started on: ${dateStart}\n- Ended on: ${dateEnd}.`, {code : "ml"})
                  )
                }

              })
            }
          }
        } else if (datenow < parseInt(result[i].expiration_timestamp)) {
          console.log(result[i].action_id, "has not yet expired.")
        }
      }

    })
  }
  , 900000)

  
// check if it' stime for a drop
  setInterval(
    function check_timestamp () {
      var datenow = Date.now()    
      connection.query(`SELECT points FROM hypling_users`, function (err, result, fields) {
        if (err) throw err
        var C = 4320000
        var P = []
        // console.log(result.length)
        for (i = 0; i < result.length; i++) {
          // console.log(result[i].points)
          var Ptemp = parseInt(result[i].points)
          if (isNaN(Ptemp)) {
            Ptemp = 0
          }
          P.push(Ptemp)
          // console.log(P)
        }
        var adder = (accumulator, currentValue) => accumulator + currentValue
        P = P.reduce(adder)
        // console.log(P)
        // test values
        // C = 5000
        // P = 20

        var operation = C*P
        // console.log(operation)

        connection.query(`SELECT timestamp FROM hypling_drops ORDER BY timestamp DESC LIMIT 1` , function (err, result, fields) {
          if (err) throw err
            var last_drop = parseInt(result[0].timestamp)
            var next_drop = +last_drop + +operation
            console.log(next_drop)
            console.log('last drop:', last_drop, moment(last_drop))
            console.log('next drop:', next_drop, moment(+next_drop))
            console.log('now      :', datenow, moment(datenow))

            if (next_drop <= datenow) {
              console.log('----------------------\nPoints are being distributed.')
              return drop_points(datenow, last_drop, next_drop)
            } else {
              return
            }

        })
      })
    }
  , 900000)

  // 

  function drop_points (datenow, last_drop, next_drop) {
    // check timestamps
    console.log('now:              ', datenow, moment(datenow))
    console.log('last drop:        ', last_drop, moment(last_drop))
    console.log('next drop planned:', next_drop, moment(+next_drop))

      // fetch all users from guild ↓↓ test server ↓↓ remember to change
      var users = client.guilds.get('294063593819865088').members.map(member => member.id)
      var bot1 = '358974767216328707'  // Hypling Mgr
      var bot1pos = users.indexOf(bot1)
      users.splice(bot1pos, 1)
      var bot2 = '223944789437972490'  // Leonard
      var bot2pos = users.indexOf(bot2)
      users.splice(bot2pos, 1)

      var number_users = users.length
      var usersDB = []
      var missingUsers = []

      client.channels.get('459475561631186946').send('Attempting point drop.')
      // console.log(users)
      // fetch all users in DB
      connection.query('SELECT * FROM hypling_users', function (err, result, fields) {
        if (err) throw err
        // console.log(result)
        // create array of users in DB
        usersDB = result.map(result => result.id)
        // console.log(usersDB)
       
        // use to check things when Db and Users match 100%
        // usersDB = [ '102349822903730176',
                    // '111802386275667968',
                    // '117032512416382981',
                    // '119246849646395394',
                    // '131832027082260480',
                    // '147529721893224448',
                    // '179250599567556608',
                    // '223944789437972490',
                    // '232063666466324481',
                    // '358974767216328707' ]
        // check which users of the guild usersDB is lacking
        missingUsers = users.filter(u_id => !usersDB.includes(u_id))

        // console.log(missingUsers)

        // if users are missing from DB, add them then continue to next step (add points)
        // else add points and change timestamp
        if (missingUsers.length < 1) {
          console.log('No missing users server:db.\n----------------------')
          connection.query(`UPDATE hypling_users SET Points = COALESCE(Points, 0) + 1` , function (err, result, fields) {
            if (err) throw err
              // console.log(result)
              connection.query(`INSERT INTO hypling_drops VALUES (${datenow}, ${number_users}) `, function (err, result, fields) {
                  if (err) throw err
                    // console.log(result)
              })
            })
        } else if (missingUsers.length > 0) {
          console.log('There are', missingUsers.length, 'users missing from the database.')
          let query = missingUsers.map(id => '(\"' + id + '\", \"\")').join(', ')
          // console.log(query)
          connection.query(`INSERT INTO hypling_users VALUES ${query}`, function (err, result, fields) {
            if (err) throw err
            connection.query(`UPDATE hypling_users SET Points = COALESCE(Points, 0) + 1` , function (err, result, fields) {
              if (err) throw err
                // console.log(result)
                connection.query(`INSERT INTO hypling_drops VALUES (${datenow}, ${number_users}) `, function (err, result, fields) {
                  if (err) throw err
                    // console.log(result)
                })
              })
          })
        }
      })
  }
};
