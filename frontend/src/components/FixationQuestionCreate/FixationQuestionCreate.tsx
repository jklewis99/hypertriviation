import React, { FC, useState } from 'react';
import styles from './FixationQuestionCreate.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, Input, InputLabel, Snackbar, SnackbarContent, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { AddCircleOutline, Close, DeleteOutlineRounded, Error } from '@mui/icons-material';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { addFixationQuestion, addFixationQuestionAnswer } from '../../services/fixation.service';
import { FixationAnswer } from '../../interfaces/FixationAnswer';
import { FixationAnswerPayload } from '../../interfaces/payloads/FixationAnswer.payload';
interface FixationQuestionCreateProps {
  userId: number;
}

const FixationQuestionCreate: FC<FixationQuestionCreateProps> = (props) => {
  const [fixationId, questionIdx]: [number, number] = useLocation().state;
  // TODO: Should this just become a class as opposed to interface?
  const emptyAnswer: FixationAnswer = {
    id: 0,                // initialize to 0, as this will be updated ignored in the post request
    questionId: 0,        // initialize to 0, as this will be updated after question is created
    answerTxt: "",
    correctAnswerInd: true,
    createdBy: props.userId
  };
  const [currentQuestion, setCurrentQuestion] = useState<FixationQuestion>({
    id: 0,                    // initialize to 0, as this will be updated ignored in the post request
    fixationId: fixationId,
    questionIdx: questionIdx,
    questionTxt: '',
    multipleChoiceInd: true,
    imgUrl: '',
    videoPlaybackUrl: '',
    createdBy: props.userId,
    questionCategory: '',     // TODO
  });
  

  const [correctAnswers, setCorrectAnswers] = useState<FixationAnswer[]>([
    {
      ...emptyAnswer
    }
  ]);

  const [wrongAnswers, setWrongAnswers] = useState<FixationAnswer[]>([
    {
      ...emptyAnswer,
      correctAnswerInd: false
    }
  ]);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(true);

  const handleChange = (prop: any, event: any) => {
    setCurrentQuestion({ ...currentQuestion, [prop]: event.target.value });
    console.log(currentQuestion);
  }

  const setBooleans = (prop: any, event: any) => {
    setCurrentQuestion({ ...currentQuestion, [prop]: event.target.checked });
  };

  const writeAnswerTxt = (idx: number, answerTxt: string, isCorrect: boolean = false) => {
    let answers = isCorrect ? correctAnswers : wrongAnswers;
    answers[idx].answerTxt = answerTxt;
    if (isCorrect) {
      setCorrectAnswers([...answers]);
      return;
    }
    setWrongAnswers([...answers]);
    console.log(answers)
  }

  const addMultipleChoiceAnswer = (isCorrect: boolean = false) => {
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, {...emptyAnswer, answerTxt: ""}]);
      return;
    }
    setWrongAnswers(
      [
        ...wrongAnswers,
        {
          ...emptyAnswer,
          answerTxt: "", 
          correctAnswerInd: false
        }
      ]
    );
  }

  const removeMultipleChoiceAnswer = (idx: number, isCorrect: boolean = false) => {
    let answers = isCorrect ? correctAnswers : wrongAnswers;
    // answers.splice(idx, 1);
    console.log(answers)
    if (isCorrect) {
      setCorrectAnswers(answers.filter((_, i) => i != idx));
      return
    }
    setWrongAnswers(answers.filter((_, i) => i != idx));
  }

  const createAnswerPayload = (questionId: number) => {
    let answersPayload: FixationAnswerPayload[] = [];
    correctAnswers.forEach(answer => {
      answersPayload.push({
        question: questionId,
        answer_txt: answer.answerTxt,
        correct_answer_ind: answer.correctAnswerInd,
        created_by: answer.createdBy
      })
    });
    if (currentQuestion.multipleChoiceInd) {
      wrongAnswers.forEach(answer => {
        answersPayload.push({
          question: questionId,
          answer_txt: answer.answerTxt,
          correct_answer_ind: answer.correctAnswerInd,
          created_by: answer.createdBy
        })
      });
    }
    return answersPayload;
  }

  const isValid = () => {
    let tempErrorMessage = "The following field(s) cannot be empty: ";
    let isAnyError = false;
    if (!currentQuestion.questionTxt) {
      tempErrorMessage += "Question Text, ";
      isAnyError = true;
    }
    
    if (!correctAnswers.length || correctAnswers.some(answer => answer.answerTxt === "")) {
      tempErrorMessage += "Correct Answer(s), ";
      isAnyError = true;
    }

    if (currentQuestion.multipleChoiceInd && (!wrongAnswers.length || wrongAnswers.some(answer => answer.answerTxt === ""))) {
      tempErrorMessage += "Wrong Answer(s), ";
      isAnyError = true;
    }
    
    if (isAnyError) {
      setErrorMessage(tempErrorMessage.substring(0, tempErrorMessage.length-2));
      return false;
    }
    return true;
  }

  const errorClose = () => {
    setErrorMessage("");
  }

  const submitQuestion = () => {
    if (!isValid()) return;

    // TODO: make both question and answer post requests a single ACID transaction
    addFixationQuestion(currentQuestion)
      .then(
        (fixationQuestion) => {
          console.log(fixationQuestion);
          let answers = createAnswerPayload(fixationQuestion.id);
          addFixationQuestionAnswer(answers);
          clearQuestion();
        }
      )
      .catch(
        (error: Error) => {
          console.log(error.message);
          setErrorMessage(error.message);
          setShowErrorMessage(true);
        }
      );
  }

  const clearQuestion = () => {
    setCorrectAnswers([
      {
        ...emptyAnswer,
        answerTxt: ""
      }
    ]);
    setWrongAnswers([
      {
        ...emptyAnswer,
        answerTxt: "",
        correctAnswerInd: false
      }
    ]);
    setCurrentQuestion({
      ...currentQuestion,
      questionIdx: currentQuestion.questionIdx + 1,
      questionTxt: "",
      imgUrl: "",
      videoPlaybackUrl: "",
    });
    console.log(correctAnswers, wrongAnswers, currentQuestion);
  }

  return (
    <div className={styles.FixationQuestionCreate} data-testid="FixationQuestionCreate">
      <Card className="main-card" style={{overflowY: "scroll"}}>
        <CardHeader title="Create New Fixation Question" />
        <Divider />
        <CardContent>
          Question #{currentQuestion.questionIdx}
          <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
          <FormControl required fullWidth margin="normal">
            <TextField
              value={currentQuestion.questionTxt}
              name="questionTxt"
              label="Question Text"
              required
              className={styles.inputs}
              onChange={(event) => handleChange("questionTxt", event)}
            />
          </FormControl>
          <FormGroup style={{flexDirection: 'row', justifyContent: 'center'}}>
            <FormControlLabel
              control={
                <Switch
                  checked={currentQuestion.multipleChoiceInd}
                  onChange={(event) => setBooleans("multipleChoiceInd", event)}
                  name="multipleChoiceInd"
                />}
              label="Multiple Choice"
            />
          </FormGroup>
          <FormControl required fullWidth margin="normal">
            <TextField
              value={currentQuestion.imgUrl}
              name="imgUrl"
              label="Image Content URL (Optional)"
              className={styles.inputs}
              onChange={(event) => handleChange("imgUrl", event)}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <TextField
              value={currentQuestion.videoPlaybackUrl}
              name="videoUrl"
              label="Video Content URL (Optional)"
              className={styles.inputs}
              onChange={(event) => handleChange("videoPlaybackUrl", event)}
            />
          </FormControl>
          {
            <>
            {
              correctAnswers.map((correctAnswer: FixationAnswer, i: number) => (
                <div key={`correct-${i}`}>
                  <InputLabel>Correct Answer {correctAnswers.length > 1 ? i + 1 : ""}</InputLabel>
                  <FormControl required fullWidth margin="normal">
                    <TextField
                      value={correctAnswer.answerTxt}
                      name={`wrongAnswer${i}`}
                      label={"Correct Answer " + (correctAnswers.length > 1 ? i + 1 : "")}
                      className={styles.inputs}
                      onChange={(event) => writeAnswerTxt(i, event.target.value, true)}
                    />
                  </FormControl>
                  {correctAnswers.length > 1 ? <DeleteOutlineRounded id={`correct-button-${i}`} onClick={() => removeMultipleChoiceAnswer(i, true)}/> : null}
                </div>
                
              ))
            }
            <AddCircleOutline onClick={() => addMultipleChoiceAnswer(true)} style={{ margin: "0 20px" }}></AddCircleOutline>
            </>
          }
          {
            currentQuestion.multipleChoiceInd
            ?
            <>
              {
              wrongAnswers.map((wrongAnswer: FixationAnswer, i: number) => (
                <>
                  <InputLabel>Wrong Answer {i + 1}</InputLabel>
                  <FormControl required fullWidth margin="normal">
                    <TextField
                      value={wrongAnswer.answerTxt}
                      name={`wrongAnswer${i}`}
                      label={`Wrong Answer ${i + 1}`}
                      className={styles.inputs}
                      onChange={(event) => writeAnswerTxt(i, event.target.value)}
                    />
                  </FormControl>
                  <DeleteOutlineRounded onClick={() => removeMultipleChoiceAnswer(i)}/>
                </>
                
              ))
              }
              <AddCircleOutline  onClick={() => addMultipleChoiceAnswer()} style={{ margin: "0 20px" }}></AddCircleOutline>
            </>
            :
            null
          }
        </CardContent>
        {errorMessage ? (
          <Snackbar
            // variant="error"
            key={errorMessage}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            open={showErrorMessage}
            onClose={errorClose}
          // autoHideDuration={3000}
          >
            <SnackbarContent
              className={styles.error}
              message={
                <div className={styles.innerError}>
                  {/* <span style={{ marginRight: "8px" }}> */}
                  <Error fontSize="large" color="error" style={{ padding: "0 10px" }} />
                  {/* </span> */}
                  <span> {errorMessage} </span>
                </div>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  onClick={errorClose}
                >
                  <Close color="error" />
                </IconButton>
              ]}
            />
          </Snackbar>
        ) : null}
        <CardActions className="card-actions">
          <Button size="medium" variant="contained" color="secondary" to="/" component={Link} style={{ margin: "10px 20px" }}>Finish</Button>
          <Button size="medium" variant="contained" color="primary" onClick={submitQuestion} style={{ margin: "0 20px" }}>Next</Button>
        </CardActions>
      </Card>
    </div>
  );
}
export default FixationQuestionCreate;
