exports.run = (client, message, params) => {
  console.log(message.author.id)
      try {
        var code = params.join(' ')
        console.log(code)
        var evaled = eval(code)

        if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled)

        message.channel.send(clean(evaled), { code: 'xl', split : {prepend: '**', append: '**'} })
      } catch(err) {
        message.channel.send('\`\`\`ERROR\`\`\`')
        message.channel.send(`${clean(err)}`, { code: 'xl' })
      }

      // clean text for eval
      function clean(text) {
      if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
          return text
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'eval',
  description: 'Limited to the bot owner.',
  usage: 'eval <code>'
};
