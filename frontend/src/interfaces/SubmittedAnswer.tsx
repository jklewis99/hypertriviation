export interface SubmittedAnswer {
  playerUsername: string;
  submittedAnswerTxt: string;
  isCorrectAnswer: boolean;
  answerIdx?: number;
}