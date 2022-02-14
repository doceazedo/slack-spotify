import fetch from 'node-fetch';
import type { TrackInfo } from '../types';

const baseURL = 'http://localhost:2626';

export const getCurrentPlayingBeatmap = async (): Promise<TrackInfo> => {
  const data = await(await fetch(`${baseURL}/osuSong.txt`)).text();
  const beatmapInfo = data.split(';;');
  return {
    title: beatmapInfo[0],
    artist: `${beatmapInfo[1]}`,
  }
}
