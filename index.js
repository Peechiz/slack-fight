const { text, send } = require('micro')
const qs = require('querystring')
const {promisify} = require('util')
const get = promisify(require('request'))

const TOKEN = process.env.SLACK_TOKEN

function fight(arr){
  const id = Math.floor(Math.random() * arr.length)
  const winner = arr.splice(id,1)
  return {winner, losers: arr}
}

module.exports = async (req, res) => {

  console.log('Starting a fight!')

  const query = await text(req);

  const data = qs.parse(query);
  const fighters = data.text;
  const channel = data.channel_id;

  if (fighters.toLowerCase() == 'all'){

    get({
      method: 'GET',
      uri: 'https://slack.com/api/channels.info',
      qs: {
        channel,
        token: TOKEN
      },
      json: true
    }).then(data => {
      data = data.body
      const {winner} = fight(data.channel.members);

      send(res, 200, {
        "response_type": "in_channel",
        "text": `<@${winner}> defeats everyone in the channel!`,
      })
    })

  } else {

    let {winner, losers} = fight(fighters.split(' '))
    if (losers.length === 1){
      losers = losers[0]
    } else if (losers.length === 2) {
      losers = losers.join(' and ')
    } else {
      losers[losers.length - 1] = 'and ' + losers[losers.length - 1]
      losers = losers.join(', ')
    }
    send(res, 200, {
      "response_type": "in_channel",
      "text": `${winner} defeats ${losers}!`,
    })
  }
}
