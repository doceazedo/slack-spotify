export type Track = SpotifyApi.TrackObjectFull & {
  isPlaying: boolean;
}

export type TrackInfo = {
  artist: string;
  title: string;
}

export type Language = {
  status: string;
  unknownArtist: string;
  unknownTrack: string;
  nothingPlaying: string;
  trackPaused: string;
  trackUpdated: string;
  appStarting: string;
  appStarted: string;
  appClosed: string;
  spotifyTokenRefreshing: string;
  spotifyTokenRefreshed: string;
};