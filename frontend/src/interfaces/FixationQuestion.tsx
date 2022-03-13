export interface FixationQuestion {
  id: number;
  fixationId: string;
  questionIdx: number;
  questionTxt: string;
  multipleChoiceInd: boolean;
  imgUrl: string;
  videoPlaybackUrl: string;
  createdBy: number;
  questionCategory: string;
  createdAt: string;
  updatedAt: string;
}