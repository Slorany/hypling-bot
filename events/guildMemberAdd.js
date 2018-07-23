module.exports = member => {
    let guild = member.guild
    let guildid = guild.id

    console.log(`Member ${member.username} (${member.id}) joined the server.`)

    connection.query(`INSERT INTO hypling_users VALUES ("${member.id}",${0})` , function (err, result, fields) {
        if (err) throw err
        console.log(`Member ${member.username} (${member.id}) was added to the database.`)
    })
}