export interface FixationSessionSettings {
  fixationSessionCode: string;
  showHintsInd: boolean;
  multipleChoiceInd: boolean;
  randomShuffleInd: boolean;
  stopOnAnswerInd: boolean;
  spotifyRandomStartInd: boolean;
  timeLimit: number;
  activeInd?: boolean;
  createdTs?: Date;
}