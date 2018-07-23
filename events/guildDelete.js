module.exports = guild => {
  var guildid = guild.id
  var guildownerid = guild.ownerID
  var guildownername = guild.owner.displayName
  var guildname = guild.name

  var d = new Date().toISOString().replace('T', ' ').substr(0, 19)

  var deletedGuildLog = `${d} UTC - I have been removed from the guild ${guildname} (${guildid}), owned by ${guildownername} (${guildownerid}).`

  console.log(deletedGuildLog)

}
