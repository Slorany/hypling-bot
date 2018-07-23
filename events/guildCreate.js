module.exports = guild => {
  var guildid = guild.id
  var guildownerid = guild.ownerID
  var guildownername = guild.owner.displayName
  var guildname = guild.name

  var d = new Date().toISOString().replace('T', ' ').substr(0, 19)

  var newGuildLog = `${d} UTC - I have been added to the guild ${guildname} (${guildid}), owned by ${guildownername} (${guildownerid}).`

  console.log(newGuildLog)

}
