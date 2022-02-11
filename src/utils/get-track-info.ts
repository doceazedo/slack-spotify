import 'dotenv/config';
import { badwords } from '../helpers';
import { getTranslations } from './get-translations';
import type { TrackInfo } from '../types';

const lang = getTranslations(process.env?.LANGUAGE || 'en_US');
const filter = process.env?.FILTER_BADWORDS == 'true' ? true : false;

const filterBadwords = (str: string) => {
  badwords.forEach((badword) => {
    const regex = new RegExp(`(?<![A-Za-z0-9])${badword}(?![A-Za-z0-9])`, 'gi');
    str = str.replace(regex, '*'.repeat(badword.length));
  });

  return str;
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