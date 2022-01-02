import React, { useEffect, useState } from 'react';
import styles from './FixationList.module.scss';
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
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
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h3" color="inherit" style={{ width: '100%' }} noWrap>
          Choose a Trivia Session
        </Typography>
        <Grid container alignItems="center" justifyContent="center">
          {
            isLoading
              ?
              <Loader />
              :
              <Grid container spacing={2}>
                {
                  fixations.map((fixation: Fixation, i: number) => (
                    <Grid item xs={i % 2 === 0 ? 8 : 4}>
                      <FixationCard
                      fixation={fixation}
                        key={Math.floor(Date.now() + i)}
                      />
                    </Grid>
                  ))
                }
              </Grid>
          }
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default FixationList;
