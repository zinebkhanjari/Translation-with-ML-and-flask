import React, { useState } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import GTranslateIcon from "@material-ui/icons/GTranslate";
import Alert from "@material-ui/lab/Alert";

import axios from "axios";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const App = () => {
  const classes = useStyles();

  const url = process.env.REACT_APP_BACKEND_URL + "/prediction";

  const [textInEnglish, setTextInEnglish] = useState("");
  const [textInFrench, setTextInFrench] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handelSubmit = (e) => {
    e.preventDefault();
    translate();
  };
  const translate = () => {
    setIsLoading(true);
    setTextInFrench("");
    axios
      .get(url, {
        params: {
          text: textInEnglish,
        },
      })
      .then((response) => {
        if (response.data && response.data.prediction)
          setTextInFrench(response.data.prediction);

        if (response.data && response.data.message)
          setErrors([...errors, response.data.message]);

        if (response.data && response.data.exception)
          setErrors([...errors, response.data.exception]);
      })
      .catch((error) => {
        console.log(error);
        setErrors([...errors, error.message]);
      })
      .then(() => {
        setIsLoading(false);
        if (errors.length > 0)
          setTimeout(() => {
            setErrors([]);
          }, 3000);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <GTranslateIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          translation
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            disabled={isLoading}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            required
            fullWidth
            id="english"
            label="English"
            name="english"
            autoFocus
            onChange={(e) => setTextInEnglish(e.target.value)}
          />
          <TextField
            disabled
            value={textInFrench}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            fullWidth
            label="French"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handelSubmit}
          >
            Translate
          </Button>
          {isLoading && (
            <Grid style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Grid>
          )}
          {errors.map((error, index) => (
            <Alert key={index} severity="error">
              {error}
            </Alert>
          ))}
        </form>
      </div>
    </Container>
  );
};

export default App;
