import React, { useState } from 'react';
import styles from './UserForm.module.scss';
import {
  Avatar, Button, FormControl,
  IconButton, Input, InputAdornment,
  InputLabel, Paper, Snackbar, SnackbarContent, Card, CardHeader, Typography
} from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Error, VisibilityOff, Visibility, PeopleAlt, Close } from '@mui/icons-material';
import { login, register } from '../../services/user.service';
import { useNavigate } from 'react-router';

const UserForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(true);
  const [isRegistrataion, setIsRegistrataion] = useState<boolean>(false);
  const navigate = useNavigate();

  const [values, setValues] = React.useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
  });
  const registerFieldNames: {[key: string]: string} = {
    username: "Username",
    firstName: "First Name",
    lastName: "Last Name",
    email: "E-mail",
    password: "Password",
    passwordConfirm: "Confirm Password"
  };
  const loginFieldNames: {[key: string]: string} = {
    username: "Username",
    password: "Password"
  };

  const handleChange = (prop: any, event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };


  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const errorClose = () => {
    setErrorMessage("");
  }

  const isValid = () => {
    let tempErrorMessage = "The following field(s) cannot be empty: ";
    let isAnyError = false;
    
    if (isRegistrataion) {
      for (const [key, value] of Object.entries(values)){
        if (value === ""){
          tempErrorMessage += " " + registerFieldNames[key] + ", ";
          isAnyError = true;
        }
      }
    }
    else {
      if (values.username === ""){
        tempErrorMessage += " " + registerFieldNames["username"] + ", ";
        isAnyError = true;
      }
      if (values.password === ""){
        tempErrorMessage += " " + registerFieldNames["password"] + ", ";
        isAnyError = true;
      }
    }
    if (isAnyError) {
      setErrorMessage(tempErrorMessage.substring(0, tempErrorMessage.length-2));
      return false;
    }


    if (isRegistrataion){
      if (values.password !== values.passwordConfirm) {
        setErrorMessage("Passwords do not match");
        setShowErrorMessage(true);
        return false;
      }
    }
    return true;
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!isValid()) return;

    if (isRegistrataion){
      register(values.username, values.password, values.email, values.firstName, values.lastName)
        .then((data) => {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          navigate("/user/myaccount");
        })
        .catch((error: Error) => {
          setErrorMessage(error.message);
          setShowErrorMessage(true);
        });
    }
    else {
      login(values.username, values.password)
        .then((data) => {
          if (data) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate("/user/myaccount");
          }
          else {
            setErrorMessage("No user found.");
            setShowErrorMessage(true);
          }
        })
        .catch((error: Error) => {
          setErrorMessage(error.message);
          setShowErrorMessage(true);
        });
    }
  }

  return (
    <div className={styles.UserForm} data-testid="UserForm">
      <Card className={styles.paper}>
        <CardHeader title={isRegistrataion ? "Register" : "Login"} />
        <form
          className={styles.form}
          onSubmit={() => handleSubmit}
        >
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="email" className={styles.labels}>
              Username
            </InputLabel>
            <Input
              name="username"
              type="username"
              autoComplete="username"
              className={styles.inputs}
              disableUnderline={true}
              onChange={(event) => handleChange("username", event)}
            />
          </FormControl>
          {
            isRegistrataion
              ?
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="email" className={styles.labels}>
                  First Name
                </InputLabel>
                <Input
                  name="username"
                  type="username"
                  autoComplete="username"
                  className={styles.inputs}
                  disableUnderline={true}
                  onChange={(event) => handleChange("firstName", event)}
                />
              </FormControl>
              : null
          }
          {
            isRegistrataion
              ?
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="email" className={styles.labels}>
                  Last Name
                </InputLabel>
                <Input
                  
                  name="username"
                  type="username"
                  autoComplete="username"
                  className={styles.inputs}
                  disableUnderline={true}
                  onChange={(event) => handleChange("lastName", event)}
                />
              </FormControl>
              : null
          }
          {
            isRegistrataion
              ?
              <FormControl required fullWidth margin="normal">
                <InputLabel htmlFor="email" className={styles.labels}>
                  E-mail
                </InputLabel>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={styles.inputs}
                  disableUnderline={true}
                  onChange={(event) => handleChange("email", event)}
                />
              </FormControl>
              : null
          }
          

          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="password" className={styles.labels}>
              Password
            </InputLabel>
            <Input
              name="password"
              autoComplete="password"
              className={styles.inputs}
              disableUnderline={true}
              onChange={(event) => handleChange("password", event)}
              type={!values.showPassword ? "password" : "input"}
              endAdornment={
                !values.showPassword ? (
                  <InputAdornment position="end">
                    <VisibilityOff
                      // fontSize="default"
                      className={styles.passwordEye}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <Visibility
                      // fontSize="default"
                      className={styles.passwordEye}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    />
                  </InputAdornment>
                )
              }
            />
          </FormControl>

          {
            isRegistrataion
              ?
              <FormControl required fullWidth margin="normal" disabled={values.password === ""}>
                <InputLabel className={styles.labels} >
                  Confirm Password
                </InputLabel>
                <Input
                  name="passwordConfrim"
                  autoComplete="passwordConfrim"
                  className={styles.inputs}
                  disableUnderline={true}
                  onChange={(event) => handleChange("passwordConfirm", event)}
                  type={!values.showPassword ? "password" : "input"}

                />
              </FormControl>
              : null
          }

          <Button
            // disabled={!isValid()}
            fullWidth
            variant="outlined"
            className={styles.button}
            onClick={handleSubmit}
            sx={{
              ':hover': {
                color: 'black',
                borderColor: 'white'
              }
            }
            }
          >
            {isRegistrataion ? "Join" : "Sign In"}
          </Button>

          <Typography className={styles.setRegister}>
            {isRegistrataion ? "Already a user? Sign In " : "Not a user yet? Register for an account "}<a onClick={() => setIsRegistrataion(!isRegistrataion)} style={{ textDecoration: "underline", cursor: "pointer" }}>here</a>
          </Typography>
        </form>

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
      </Card>
    </div>
  );
}

export default UserForm;
