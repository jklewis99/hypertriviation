import React, { useEffect, useState } from 'react';
import styles from './FixationList.module.scss';
import { TextField, Button, Grid, Typography, Box, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import FixationCard from '../FixationCard/FixationCard';
import { getAllFixations } from '../../services/fixation.service';
import { Fixation } from '../../interfaces/Fixation';
import Loader from '../Loader/Loader';

const FixationList = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fixations, setFixations] = useState<Fixation[]>([]);

  useEffect(() => {
    let mounted = true;
    getAllFixations().then(
      data => {
        // debugger;
        // if (mounted)
          setFixations(data);
      }
    ).catch(
      error => {
        // if (mounted)
          setErrorMessage(error);
      }
    ).finally(
      () => {
        // if (mounted)
          setIsLoading(false)
      }
    );
    return () => {
      mounted = false;
    }
  }, []);


  return (
    <div className={styles.StartSession} data-testid="StartSession">
      <Box style={{height: "90vh", display: "flex", flexDirection: "column", overflow: "none"}}>
        <Typography variant="h3" color="inherit" style={{ width: '100%' }} noWrap>
          Choose a Trivia Session
        </Typography>
        <Divider/>
        <Box style={{overflowY: "scroll", flex: "1",  width: "100%"}}>
          {
            isLoading
              ?
              <Loader />
              :
              <Grid container spacing={2} sx={{display: "flex", justifyContent: "center"}}>
                {
                  fixations.map((fixation: Fixation, i: number) => (
                    <Grid item>
                      <FixationCard
                      fixation={fixation}
                        key={Math.floor(Date.now() + i)}
                      />
                    </Grid>
                  ))
                }
              </Grid>
          }
        </Box>

        <Box style={{padding: "5px"}}>
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default FixationList;
