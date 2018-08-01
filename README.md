# Fight to the Death!

A tiny microservice to support a slash command in slack.

`/fight <user1> <user2> ... || "all"` returns winner of fight or winner of Battle Royale of whole slack channel.

## Installation

`npm install`

requires a `.env` file with `SLACK_TOKEN=<your-slack-token>`.  Additionally, since `/fight all` needs to query the channel, you must enable `channel:read` permissions in slack.
