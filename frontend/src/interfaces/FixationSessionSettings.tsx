export interface FixationSessionSettings {
  fixationSessionCode: string;
  showHintsInd: boolean;
  multipleChoiceInd: boolean;
  randomShuffleInd: boolean;
  stopOnAnswerInd: boolean;
  timeLimit: number;
  activeInd?: boolean;
  createdTs?: Date;
}