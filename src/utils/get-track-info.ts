import 'dotenv/config';
import { badwords } from '../helpers';
import { getTranslations } from './get-translations';
import type { TrackInfo } from '../types';

const lang = getTranslations(process.env?.LANGUAGE || 'en_US');
const filter = process.env?.FILTER_BADWORDS == 'true' ? true : false;
const separators = ['.', ',', ';', ':', '-'];

const filterBadwords = (str: string) => {
  let words = str.split(' ');
  words.forEach((word, i) => {
    if (badwords.includes(word.toLowerCase())) {
      words[i] = '*'.repeat(word.length);
      return;
    }
    
    // This will help filter words followed by a comma or something like that
    if (
      separators.includes(word.charAt(word.length - 1)) &&
      badwords.includes(word.slice(0, -1).toLowerCase())
    ) {
      words[i] = '*'.repeat(word.length - 1) + word.charAt(word.length - 1);
      return;
    }
  });
  return words.join(' ');
}

export const getTrackInfo = (track: SpotifyApi.TrackObjectFull | null): TrackInfo => {
  let artist = track?.artists?.[0].name || lang.unknownArtist;
  let title = track?.name || lang.unknownTrack;

  if (filter) {
    // Not sure if filtering the artist name is really necessary
    // artist = filterBadwords(artist);
    title = filterBadwords(title);
  }

  return {
    artist,
    title
  }
}