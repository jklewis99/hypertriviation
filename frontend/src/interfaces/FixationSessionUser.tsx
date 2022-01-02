export interface FixationSessionUser {
  fixationSessionCode: string;
  username: string;
  firstName: string,
  lastName: string,
  isHost: boolean;
  activeInd: boolean;
  addedAt: string;
}