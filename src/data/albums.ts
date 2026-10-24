export type Album = {
  slug: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  favoriteTrack: {
    title: string;
    spotifyUrl: string;
  };
};

export const favoriteAlbums: Album[] = [
  {
    slug: 'black-sabbath',
    title: 'black sabbath',
    artist: 'black sabbath',
    spotifyUrl: 'https://open.spotify.com/album/3OmnatFgQ8o1DlYLp9EpNJ',
    favoriteTrack: {
      title: 'the wizard',
      spotifyUrl: 'https://open.spotify.com/track/0CHJMgNilqjPPFXtUuc9gQ',
    },
  },
  {
    slug: 'rubber-soul',
    title: 'rubber soul',
    artist: 'the beatles',
    spotifyUrl: 'https://open.spotify.com/album/50o7kf2wLwVmOTVYJOTplm',
    favoriteTrack: {
      title: 'nowhere man',
      spotifyUrl: 'https://open.spotify.com/track/5SUlhldQJtOhUr2GzH5RI7',
    },
  },
  {
    slug: 'significant-other',
    title: 'significant other',
    artist: 'limp bizkit',
    spotifyUrl: 'https://open.spotify.com/album/3HCCUaRSjHSFOe4fqE0BiP',
    favoriteTrack: {
      title: 'break stuff',
      spotifyUrl: 'https://open.spotify.com/track/5cZqsjVs6MevCnAkasbEOX',
    },
  },
];
