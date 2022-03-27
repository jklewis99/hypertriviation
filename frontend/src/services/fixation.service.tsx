import { Fixation } from "../interfaces/Fixation";
import { FixationAnswer } from "../interfaces/FixationAnswer";
import { FixationQuestion } from "../interfaces/FixationQuestion";
import { FixationSession } from "../interfaces/FixationSession";
import { FixationSessionPlayer } from "../interfaces/FixationSessionPlayer";
import { FixationSessionSettings } from "../interfaces/FixationSessionSettings";
import { FixationSessionUser } from "../interfaces/FixationSessionUser";
import { FixationAnswerPayload } from "../interfaces/payloads/FixationAnswer.payload";
import { SetFixationSessionSettings } from "../interfaces/payloads/SetFixationSessionSettings.payload";
import httpClient from "../utils/httpClient";

const relativePath = "api/fixations";

export function createFixation(fixation: any): Promise<Fixation> {
  const requestOptions = {
    "created_by": fixation.createdBy,
    "fixation_title": fixation.title,
    "category": "Other",
    "description": fixation.description,
    "img_url": fixation.imgUrl,
    "keep_shuffled": true
  };
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/create`,
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

export function getFixationQuestion(questionId: number): Promise<FixationQuestion> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/question/${questionId}`
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function addFixationQuestion(question: FixationQuestion): Promise<FixationQuestion> {
  const body = {
    'fixation': question.fixationId,
    'question_idx': question.questionIdx,
    'question_txt': question.questionTxt,
    'multiple_choice_ind': question.multipleChoiceInd,
    'img_url': question.imgUrl,
    'video_playback_url': question.videoPlaybackUrl,
    'created_by': question.createdBy,
    'question_category': question.questionCategory
  };

  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/question`,
      body
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function getFixationQuestionAnswers(questionId: number): Promise<FixationAnswer[]> {
  return new Promise((resolve, reject) => {
    httpClient.get(
      `${relativePath}/answers/${questionId}`
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function addFixationQuestionAnswer(answers: FixationAnswerPayload[]): Promise<string> {
  const requestBody = {
    "answers": answers
  }
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/answers`,
      requestBody
    )
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error));
  });
}

export function setFixationQuestionAnswers(questionId: number): Promise<string> {
  throw Error;
  return new Promise((resolve, reject) => {
    httpClient.post(
      `${relativePath}/answers/${questionId}`
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
