import { SetFixationSessionSettings } from "../payloads/SetFixationSessionSettings.payload";

export interface FixationSettingsProps {
  setSettingsCallback: (event: any, value?: number) => void;
}