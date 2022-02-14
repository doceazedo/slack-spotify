import 'dotenv/config';
import process from 'process';
import { getCurrentPlayingTrack, clearStatus, updateStatus, getCurrentPlayingBeatmap } from './services';
import { loggr, getTranslations, getTrackInfo } from './utils';
import type { Track, TrackInfo } from './types';

const lang = getTranslations(process.env?.LANGUAGE || 'en_US');
const statusEmoji = process.env?.SONG_EMOJI;
const interval = 5000;

let nowPlaying: Track | null = null;
let nowPlayingOsu: TrackInfo | null = null;

const main = async () => {
  if (process.argv.slice(2)?.[0] == '--osu') {
    const currentMap = await getCurrentPlayingBeatmap();

    // If nothing is playing, clear status
    if (currentMap == null && nowPlayingOsu) {
      nowPlayingOsu = null;
      loggr.info(lang.nothingPlaying);
      clearStatus();
      return;
    }

    // If both tracks have the same artist and title, ignore it
    if (
      currentMap.artist == nowPlayingOsu?.artist &&
      currentMap.title == nowPlayingOsu?.title
    ) return;

    // Save the new current track and update status
    nowPlayingOsu = currentMap;
    const status = lang.status
      .replace('[artist]', currentMap.artist)
      .replace('[track]', currentMap.title);
    updateStatus(status, statusEmoji || '');

    // Log the newly updated updated track
    const logMessage = lang.trackUpdated
      .replace('[artist]', currentMap.artist)
      .replace('[track]', currentMap.title);
    loggr.info(logMessage);

    return;
  }

  const currentTrack = await getCurrentPlayingTrack();

  // If nothing is playing, clear status
  if (currentTrack == null && nowPlaying) {
    nowPlaying = null;
    loggr.info(lang.nothingPlaying);
    clearStatus();
    return;
  }

  // If the song is paused, clear status
  if (!currentTrack?.isPlaying && nowPlaying?.isPlaying) {
    nowPlaying = currentTrack;
    loggr.info(lang.trackPaused);
    clearStatus();
    return;
  }

  // If both tracks have the same artist and title, ignore it
  if (
    nowPlaying?.name == currentTrack?.name &&
    nowPlaying?.artists?.[0]?.name == currentTrack?.artists?.[0]?.name &&
    nowPlaying?.isPlaying
  ) return;

  // If the song remains paused, ignore it
  if (!nowPlaying?.isPlaying && !currentTrack?.isPlaying) return;

  // Get simplified track info with filtered badwords
  const trackInfo = getTrackInfo(currentTrack);

  // Save the new current track and update status
  nowPlaying = currentTrack;
  const status = lang.status
    .replace('[artist]', trackInfo.artist)
    .replace('[track]', trackInfo.title);
  updateStatus(status, statusEmoji || '');

  // Log the newly updated updated track
  const logMessage = lang.trackUpdated
    .replace('[artist]', trackInfo.artist)
    .replace('[track]', trackInfo.title);
  loggr.info(logMessage);
}

// Handle app exit
process.on('SIGINT', async () => {
  loggr.info(lang.appClosed);
  await clearStatus();
  process.exit(0);
});

// Start the app
(async () => {
  loggr.init(lang.appStarting);
  setInterval(main, interval);
  await main();
  loggr.init(lang.appStarted);
})();