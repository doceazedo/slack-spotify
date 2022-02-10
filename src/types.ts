export type Track = SpotifyApi.TrackObjectFull & {
  isPlaying: boolean;
}

export type Language = {
  status: string;
  nothingPlaying: string;
  trackPaused: string;
  trackUpdated: string;
  appStarted: string;
  appClosed: string;
};