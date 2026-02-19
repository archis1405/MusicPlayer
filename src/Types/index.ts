export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  MainTabs: { screen?: keyof BottomTabParamList } | undefined; // Nested tab param
  Player: undefined;
  Queue: undefined;
  ArtistDetail: { artistId: string };
  AlbumDetail: { albumId: string };
};
