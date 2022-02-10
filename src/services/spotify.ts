import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';
import { hasPassedTwoHours, loggr } from '../utils';
import type { Track } from '../types';

const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyApi = new SpotifyWebApi();

let lastRefresh = new Date(0);

spotifyApi.setCredentials({
  refreshToken,
  clientId,
  clientSecret,
});

const handleError = (error: any) => {
  loggr.error('Spotify API returned an error:');
  loggr.error(error);
}

const refreshAccessToken = async () => {
  if (!hasPassedTwoHours(lastRefresh)) return;

  try {
    const spotifyTokens = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(spotifyTokens.body.access_token);
    lastRefresh = new Date();
  } catch (error) {
    handleError(error);
  }
}

export const getCurrentPlayingTrack = async (): Promise<Track | null> => {
  await refreshAccessToken();
  
  try {
    const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();

    // If nothing is playing, return null
    if (currentlyPlaying.body?.item == null) return null;
    // If there are no artists, return null
    if (!('artists' in currentlyPlaying.body?.item)) return null;

    const track: Track = {
      isPlaying: currentlyPlaying.body?.is_playing || false,
      ...currentlyPlaying.body?.item
    }
    return track;
  } catch (error) {
    handleError(error);
    return null;
  }
}