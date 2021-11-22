require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const SpotifyWebApi = require('spotify-web-api-node');

const slackToken = process.env.SLACK_TOKEN;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const songEmoji = process.env.SONG_EMOJI;
const lunchEmoji = process.env.LUNCH_EMOJI;
const lunchHour = Number(process.env.LUNCH_HOUR);

const web = new WebClient(slackToken);

const spotifyApi = new SpotifyWebApi();
spotifyApi.setCredentials({
  refreshToken,
  clientId,
  clientSecret,
});

let nowPlaying = null;
let lunching = false;

const updateStatus = async (status_text, status_emoji, status_expiration = 0) => {
  return await web.users.profile.set({
    profile: {
      status_text,
      status_emoji,
      status_expiration
    }
  });
}

const getCurrentSong = async () => {
  const spotifyTokens = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(spotifyTokens.body.access_token);

  const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();
  return currentlyPlaying.body?.item || null;
}

const setNextStatus = async () => {
  if (lunchHour) {
    const date = new Date();
    if (date.getHours() == lunchHour) {
      if (lunching) return;

      date.setHours(lunchHour + 1);
      date.setMinutes(0);
      date.setSeconds(0);

      updateStatus('Almoçando', lunchEmoji, Math.floor(date.getTime() / 1000));
      console.log('Hora do almoço! 😋🍽');
      lunching = true;

      return;
    } else {
      lunching = false;
    }
  }

  const current = await getCurrentSong();
  if (nowPlaying && current == null) {
    updateStatus('', '');
    nowPlaying = null;
    console.log('Nada tocando, limpando status... 🧹');

    return;
  }

  if (nowPlaying?.name == current?.name) return;

  nowPlaying = current;
  const status = `Ouvindo ${nowPlaying.artists[0].name} - ${nowPlaying.name}`;
  updateStatus(status, songEmoji);
  console.log(`${status} 🎵`);
}

setInterval(setNextStatus, 5000);
setNextStatus();
console.log('Iniciado, é hora do rock! 🤘');