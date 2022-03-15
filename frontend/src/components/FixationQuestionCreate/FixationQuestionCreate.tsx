import React, { FC, useState } from 'react';
import styles from './FixationQuestionCreate.module.scss';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, FormControlLabel, FormGroup, Input, InputLabel, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { FixationQuestion } from '../../interfaces/FixationQuestion';
import { addFixationQuestion } from '../../services/fixation.service';
interface FixationQuestionCreateProps {}

const FixationQuestionCreate: FC<FixationQuestionCreateProps> = () => {
  const [currentQuestion, setCurrentQuestion] = useState<FixationQuestion>({
    id: 0,
    fixationId: "4",
    questionIdx: 0,
    questionTxt: '',
    multipleChoiceInd: true,
    imgUrl: '',
    videoPlaybackUrl: '',
    createdBy: 1,
    questionCategory: '',
  });
  const handleChange = (prop: any, event: any) => {
    setCurrentQuestion({ ...currentQuestion, [prop]: event.target.value });
    console.log(currentQuestion);
  }

  const addQuestion = () => {
    addFixationQuestion(currentQuestion)
      .then(
        (success) => {
          console.log(success);
        }
      )
      .catch(
        (error: Error) => {
          console.log(error.message);
        }
      );
  }
  
  return (
    <div className={styles.FixationQuestionCreate} data-testid="FixationQuestionCreate">
      FixationQuestionCreate 
      <Card className="main-card">
        <CardHeader title="Create New Fixation Question" />
        <Divider />
        <CardContent>
          Question # {1}
          <InputLabel id="demo-simple-select-label">Category Type</InputLabel>
          

          <FormControl required fullWidth margin="normal">
            <TextField
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
                  onChange={handleChange}
                  name="isMultipleChoice"
                />}
              label="Multiple Choice"
            />
          </FormGroup>
          <FormControl required fullWidth margin="normal">
            <TextField
              name="questionAnswer"
              label="Answer"
              required
              className={styles.inputs}
              multiline
              maxRows={4}
              inputProps={{ maxLength: 240 }}
              onChange={(event) => handleChange("questionAnswer", event)}
            />
          </FormControl>
          <FormControl required fullWidth margin="normal">
            <TextField
              name="contentUrl"
              label="Content URL"
              required
              className={styles.inputs}
              // multiline
              // maxRows={4}
              onChange={(event) => handleChange("contentUrl", event)}
            />
          </FormControl>

        </CardContent>
        {/* <FixationSettings setSettingsCallback={setSettings} /> */}
        <CardActions className="card-actions">
          <Button size="medium" variant="contained" color="secondary" onClick={() => {}} style={{ margin: "10px 20px" }}>Finish</Button>
          <Button size="medium" variant="contained" color="primary" onClick={addQuestion} style={{ margin: "0 20px" }}>Next</Button>
        </CardActions>
      </Card>
    </div>
  );
}
export default FixationQuestionCreate;
