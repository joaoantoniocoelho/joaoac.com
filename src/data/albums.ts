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
      spotifyUrl: 'https://open.spotify.com/track/02VKxjok07ypt3oFlGRjmH',
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
    slug: 'appetite-for-destruction',
    title: 'appetite for destruction',
    artist: "guns n' roses",
    spotifyUrl: 'https://open.spotify.com/album/28yHV3Gdg30AiB8h8em1eW',
    favoriteTrack: {
      title: 'nightrain',
      spotifyUrl: 'https://open.spotify.com/track/7CBFRsUz1pz1cS12soVhih',
    },
  },
];
