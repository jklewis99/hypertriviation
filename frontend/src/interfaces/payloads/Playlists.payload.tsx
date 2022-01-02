export interface PlaylistsResponse {
  href: string;
  items: Playlist[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

interface Playlist {
  collaborative: boolean;
  description: string;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primaryColor?: any;
  public: boolean;
  snapshotId: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

interface Tracks {
  href: string;
  total: number;
}

interface Owner {
  displayName: string;
  externalUrls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface Image {
  height?: number;
  url: string;
  width?: number;
}

interface ExternalUrls {
  spotify: string;
}