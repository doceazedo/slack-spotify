# 🎵 slack-spotify
Let your co-workers know what you're listening to (and when you're out for lunch because why not)

![](assets/screenshot.png)

## Installation

1. Create a [Slack app](https://api.slack.com/apps) with the `users.profile:write` user scope and grab an OAuth token for your workspace (at the **OAuth & Permissions** page);
2. Create a [Spotify app](https://developer.spotify.com/dashboard/login) and grab your [refresh token](https://benwiz.com/blog/create-spotify-refresh-token/);
3. Optionally, add the [Spotify](assets/spotify.png) emoji to your workspace;
4. Rename the ".env.example" file to ".env" and fill it in.
    - The `LUNCH_HOUR` is optional and may be a number between (0 - 23)
    - The emojis may be any valid Slack shortcodes, including custom ones

## Usage

Run it with `node .` and you're good to go, yet you could use something like [pm2](https://npmjs.com/package/pm2) for more control over the application.

## Disclaimer

The string literals are all in pt-BR and I don't intend to translate it anytime soon. It's pretty easy to change them tho.