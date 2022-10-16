export type TrackId = string;
export type ArtistId = string;
export type AlbumId = string;

export interface TrackModel {
  id: TrackId;
  name: string;
  artists?: ArtistModel[];
  album?: AlbumModel;
  source: string;
}

export interface ArtistModel {
  id: ArtistId;
  name: string;
}

export interface AlbumModel {
  id: AlbumId;
  name: string;
  coverImgUrl?: string;
  coverImg?: Blob;
}
