import { HypertriviationUser } from "../interfaces/HypertriviationUser";
import { UserAuthorization } from "../interfaces/UserAuthorization";
import httpClient, { getAuthorizationHeader } from "../utils/httpClient";

const relativePath = "authapi";

export function login(username: string, password: string): Promise<UserAuthorization> {
  const user = {
    username: username,
    password: password
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/token/obtain/`,
      user
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function register(username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string): Promise<UserAuthorization> {
  const user = {
    username: username,
    password: password,
    email: email,
    first_name: firstName,
    last_name: lastName
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/user/create/`,
      user
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getUser(username?: string): Promise<HypertriviationUser> {
  // if (username) return;
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/user/get`,
      getAuthorizationHeader()
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}