export interface Fixation {
  id: number;
  createdBy: string;
  fixationTitle: string;
  category: string;
  description?: string;
  imgUrl: string;
  keepShuffled: boolean;
  spotifyPlaylistId: string;
  spotifyRandomStartInd: boolean;
  defaultDuration: number;
  questionCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}