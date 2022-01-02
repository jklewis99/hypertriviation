export interface SetFixationSessionSettings {
  fixation_session_code: string;
  show_hints_ind: boolean;
  multiple_choice_ind: boolean;
  random_shuffle_ind: boolean;
  stop_on_answer_ind: boolean;
  time_limit: number;
}