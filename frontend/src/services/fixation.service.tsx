import { Fixation } from "../interfaces/Fixation";
import { FixationSession } from "../interfaces/FixationSession";
import { FixationSessionPlayer } from "../interfaces/FixationSessionPlayer";
import { FixationSessionSettings } from "../interfaces/FixationSessionSettings";
import { FixationSessionUser } from "../interfaces/FixationSessionUser";
import { SetFixationSessionSettings } from "../interfaces/payloads/SetFixationSessionSettings.payload";
import httpClient from "../utils/httpClient";

const relativePath = "api/fixations";

export function createFixations(): Promise<Fixation> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // votes_to_skip: votesToSkip,
      // guest_can_pause: guestCanPause,
    }),
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      "/api/create-game-instance",
      requestOptions
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

/**
 * 
 * @returns List of GameInstances to be rendered on the ___ page
 */
export function getAllFixations(): Promise<Fixation[]> {
  // const requestOptions = {
  //   method: "GET",
  //   // headers: { "Content-Type": "application/json" },
  // };
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}`
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getFixation(fixationId: number): Promise<Fixation> {
  // const requestOptions = {
  //   method: "GET",
  //   // headers: { "Content-Type": "application/json" },
  // };
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/${fixationId}`
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function setFixationSessionSettings(settings: SetFixationSessionSettings): Promise<FixationSessionSettings> {
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/set-settings`,
      settings
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getFixationSessionSettings(code: string): Promise<FixationSessionSettings> {
  // const requestOptions = {
  //   method: "GET",
  //   // headers: { "Content-Type": "application/json" },
  // };
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-settings?code=${code}`
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function startFixationSession(fixationId: number, userId: number, settings: any): Promise<FixationSession> {
  const requestOptions = {
      'fixation_id': fixationId,
      'user_id': userId // TODO: fix with user
      // 'settings': settings
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/start-session`,
      requestOptions
    )
    .then(response => {
      resolve(response.data)
    })
    .catch(error => reject(error));
  });
}

export function getFixationUsers(code: string): Promise<FixationSessionUser[]> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-users?code=${code}`
    )
    .then(response => {
      resolve(response.data)
    })
    .catch(error => reject(error));
  });
}

export function getFixationPlayers(code: string): Promise<FixationSessionPlayer[]> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-players?code=${code}`
    )
    .then(response => {
      resolve(response.data)
    })
    .catch(error => reject(error));
  });
}
