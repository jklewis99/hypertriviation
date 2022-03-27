import { FixationAnswer } from "./FixationAnswer";
import { FixationQuestion } from "./FixationQuestion";

export interface FixationQuestionsAndAnswers {
  questions: FixationQuestion[];
  answers: FixationAnswer[];
}