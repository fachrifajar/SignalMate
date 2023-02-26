import { useState } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { getAuth, sendEmailVerification } from "firebase/auth";

const auth = getAuth();

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const VerifyEmailModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const [isSent, setIsSent] = useState(false);

  const handleResend = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      setIsSent(true);
    });
  };

  const handleRedirect = () => {
    handleClose();
    // Redirect to login page
  };

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <Typography variant="h5">
            Please verify your email address.
          </Typography>
          {isSent ? (
            <Typography color="secondary">
              Verification email sent.
            </Typography>
          ) : (
            <Typography>
              A verification email has been sent to your email address.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleResend}
            disabled={isSent}
          >
            {isSent ? "Email Sent" : "Resend Email"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={handleRedirect}
          >
            Go to Login
          </Button>
        </div>
      </Fade>
    </Modal>
  );
};

export default VerifyEmailModal;
