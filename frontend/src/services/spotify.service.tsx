import { PlaylistsResponse } from "../interfaces/payloads/Playlists.payload";
import { SpotifyAuthenticationStatus } from "../interfaces/SpotifyAuthenticationStatus";
import httpClient, { getAuthorizationHeader } from "../utils/httpClient";

const relativePath = "/spotify";

export function checkAuthentication(userId: number): Promise<SpotifyAuthenticationStatus> {
  // const requestOptions = {
  //   method: "GET",
  //   // headers: { "Content-Type": "application/json" },
  // };
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/is-authenticated?userId=${userId}`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getAuthUrl(userId: number): Promise<any> {

  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-auth-url?userId=${userId}`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function setTokens(requestBody: {[key: string]: string | number}) {
  
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/set-tokens`,
      requestBody,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getTokens(userId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-tokens?userId=${userId}`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getPlaylists(userId: number): Promise<PlaylistsResponse> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/get-playlists?userId=${userId}`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function setToShuffle(state: boolean = true, device_id: string = ""): Promise<any> {
  return new Promise((resolve, reject) => {
    httpClient.put(
      `${relativePath}/shuffle?state=${state}&deviceId=${device_id}`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

// export function createPlaylist(state: boolean = true, device_id: string = ""): Promise<any> {
//   return new Promise((resolve, reject) => {
//     httpClient.put(
//       `${relativePath}/shuffle?state=${state}&deviceId=${device_id}`
//     )
//       .then(response => {
//         resolve(response.data)
//       })
//       .catch(error => reject(error));
//   });
// }