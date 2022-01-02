import { SetFixationSessionSettings } from "../payloads/SetFixationSessionSettings.payload";

export interface FixationSessionSettingsProps {
  closeModalCallback: () => void;
  startFixationCallback: (settings: SetFixationSessionSettings) => void;
}