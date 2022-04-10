export interface SetFixationSessionSettingsPayload {
  fixation_session: number;
  show_hints_ind: boolean;
  multiple_choice_ind: boolean;
  random_shuffle_ind: boolean;
  stop_on_answer_ind: boolean;
  spotify_random_start_ind: boolean;
  time_limit: number;
}