import { FixationAnswer } from "./FixationAnswer";
import { FixationQuestion } from "./FixationQuestion";

export interface FixationQuestionAndAnswers {
  question: FixationQuestion;
  answers: FixationAnswer[];
}