import { Room } from "../interfaces/Room";
import httpClient from "../utils/httpClient";
/**
 * 
 * @param votesToSkip the number of votes needed by a group to skip the song
 * @param guestCanPause specifies whether a non-host can pause the song
 */
export function createRoom(votesToSkip: number, guestCanPause: boolean): Promise<Room> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      votes_to_skip: votesToSkip,
      guest_can_pause: guestCanPause,
    }),
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      "http://127.0.0.1:8000/api/create-room",
      requestOptions
    )
    .then(response => {
      resolve(response.data)
    })
    .catch(error => reject(error));
  });
}
