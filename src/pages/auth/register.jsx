import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import * as useDb from "@/config/database";

//
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Box,
  Alert,
  AlertTitle,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
  CardActions,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoadingButton from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const MyCard = styled(Card)({
  margin: "auto",
  marginTop: "10%",
  maxWidth: 500,
  textAlign: "center",
  borderRadius: "20px",
  padding: "25px",
});

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const MyButton = styled(Button)({
  borderRadius: "20px",
  marginTop: "20px",
  background: "#7E98DF",
  color: "white",
  "&:hover": {
    background: "#7E80DF",
    border: "none",
  },
});

const SecondButton = styled(Button)({
  marginTop: "20px",
  borderRadius: "20px",
  background: "#FFFF",
  borderColor: "#7E98DF",
  color: "#7E98DF",
  "&:hover": {
    backgroundColor: "#7E98DF",
    borderColor: "#7E98DF",
    color: "#FFFF",
  },
});

const MyTextField = styled(TextField)({
  // '& label': {
  //   color: '#7E98DF',
  // },
  // '& label.Mui-focused': {
  //   color: '#7E98DF',
  // },
  // '& .MuiInput-underline:before': {
  //   borderBottomColor: '#7E98DF',
  // },
  //   "& .MuiInput-underline:after": {
  //     borderBottomColor: "#7E98DF",
  //   },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#7E98DF",
    },
    "&:hover fieldset": {
      borderColor: "#7E98DF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7E98DF",
    },
  },
});

const Register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [isErrorEmail, setIsErrorEmail] = React.useState(false);
  const [isErrorPass, setIsErrorPass] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [errorMessageEmail, setErrorMessageEmail] = React.useState("");
  const [errorMessagePass, setErrorMessagePass] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [usersList, setUsersList] = React.useState({});

  const [showModal, setShowModal] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);

  React.useEffect(() => {
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsersList(data);
      }
    });
  }, []);

  const handleRegister = () => {
    const usernameRegex = /^[a-z][a-z0-9\s]{3,30}[a-z0-9]$/;

    if (!usernameRegex.test(name)) {
      setErrorMessage(
        "Name must start with a lowercase letter, contain only letters, numbers, underscores, and spaces, and be between 3-30 characters long."
      );
      setIsError(true);
      console.log(errorMessage);
      return;
    }

    setIsError(false);
    setIsErrorEmail(false);
    setIsErrorPass(false);
    setIsLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setShowModal(true);

        const user = userCredential.user;
        console.log("user,", user);
        updateProfile(auth.currentUser, {
          displayName: name,
        }).then(() => {
          setIsLoading(false);

          // useDb.sendData("users", {
          //   ...usersList,
          //   [user.uid]: {
          //     emailVerified: user.emailVerified,
          //     email: user.email,
          //     user_id: user.uid,
          //     profile_picture: "null",
          //     fullname: user.displayName,
          //     providerId: "email/pass",
          //     created_at: user?.auth?.currentUser?.reloadUserInfo?.createdAt,
          //     password: user?.auth?.currentUser?.reloadUserInfo?.passwordHash,
          //     is_online: false,
          //   },
          // });

          console.log("auth,", auth);
          console.log("email,", email);
          console.log("password,", password);

          // Send confirmation email
          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("Verification email sent successfully");
            })
            .catch((error) => {
              console.error("Error sending verification email:", error);
            });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsLoading(false);

        if (errorMessage == "Firebase: Error (auth/invalid-email).") {
          setIsErrorEmail(true);
          setErrorMessageEmail("Please enter a valid email address");
        } else if (errorCode == "auth/email-already-in-use") {
          setIsErrorEmail(true);
          setErrorMessageEmail("Email already in use");
        } else {
          setIsErrorPass(true);
          setErrorMessagePass("Password should be at least 6 characters ");
        }

        console.log("error,", error);
        console.log("errorCode,", errorCode);
        console.log("errorMessage,", errorMessage);
      });
  };

  const handleRegisterGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            emailVerified: user.emailVerified,
            email: user.email,
            created_at: new Date().getTime(),
            user_id: user.uid,
            profile_picture: user.photoURL,
            fullname: user.displayName,
            is_online: false,
            friend_list: "null",
          },
        });
        router.push("/auth/login");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const isDisabled = !email.length || !password.length || !name.length;

  const handleResend = () => {
    setResendLoading(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setResendLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setResendLoading(false);
      });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  React.useEffect(() => {
    const getData = localStorage.getItem("user");
    const convertData = JSON.parse(getData);

    console.log("convertData....", convertData);

    if (convertData) {
      router.replace("/");
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("ONAUTHSTATECHANGED", user);
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Register</title>
        <link rel="icon" href="/main-logo.png" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <style>{`
          body {
            background-color: #e5e5e5;
          }
        `}</style>
      </Head>

      <main>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100vh">
          <Grid item xs={10} sm={8} md={6}>
            <Card
              sx={{
                width: "50vh",
                height: "auto",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
              }}>
              <CardContent
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  padding: "50px",
                }}>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center" }}>
                  <ArrowBackIosNewIcon
                    sx={{ mr: 1, color: "#7E98DF", cursor: "pointer" }}
                    onClick={handleLogin}
                  />
                  <span
                    style={{
                      flexGrow: 1,
                      textAlign: "center",
                      color: "#7E98DF",
                      fontWeight: "bold",
                      fontSize: 22,
                      marginRight: "20px",
                    }}>
                    Register
                  </span>
                </Typography>

                {/* <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    // color: "#232323",
                    fontSize: 12,
                    display: "flex",
                    justtifyContent: "flex-start",
                    top: 15,
                    position: "relative",
                  }}>
                  Let’s create your account!
                </Typography> */}

                <MyModal open={showModal} onClose={handleClose}>
                  <MyCard>
                    <CardContent>
                      <Typography variant="h4">
                        Verification email sent!
                      </Typography>

                      <Typography variant="body1" sx={{ margin: "20px" }}>
                        Please wait approximately <strong>1 minute.</strong> If
                        you still have not received the email, click the button
                        below to resend.
                      </Typography>

                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <MyButton
                          variant="contained"
                          onClick={handleResend}
                          disabled={resendLoading}>
                          {resendLoading ? "Resending..." : "Resend email"}
                        </MyButton>
                        <MyButton
                          variant="contained"
                          onClick={() =>
                            (window.location.href = "/auth/login")
                          }>
                          Already received
                        </MyButton>
                      </div>
                    </CardContent>
                  </MyCard>
                </MyModal>

                {!isError ? (
                  <MyTextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    onChange={(event) => setName(event.target.value)}
                  />
                ) : (
                  <MyTextField
                    error
                    fullWidth
                    margin="normal"
                    id="standard-error-helper-text"
                    label="Name"
                    helperText={errorMessage}
                    variant="standard"
                    onChange={(event) => setName(event.target.value)}
                  />
                )}

                {!isErrorEmail ? (
                  <MyTextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                ) : (
                  <MyTextField
                    error
                    fullWidth
                    margin="normal"
                    id="standard-error-helper-text"
                    label="Email"
                    helperText={errorMessageEmail}
                    variant="standard"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                )}

                {!isErrorPass ? (
                  <MyTextField
                    label="Password"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type={showPassword ? "text" : "password"}
                    onChange={(event) => setPassword(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <MyTextField
                    error
                    fullWidth
                    margin="normal"
                    id="standard-error-helper-text"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    helperText={errorMessagePass}
                    variant="standard"
                    onChange={(event) => setPassword(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                {!isDisabled ? (
                  isLoading ? (
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: "20px",
                        marginTop: "20px",
                        background: "#7E98DF",
                        color: "black",
                      }}
                      onClick={handleRegister}>
                      {isLoading ? "Loading..." : "Register"}
                    </LoadingButton>
                  ) : (
                    <MyButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleRegister}>
                      Register
                    </MyButton>
                  )
                ) : (
                  <MyButton
                    disabled
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRegister}>
                    Register
                  </MyButton>
                )}

                <Divider sx={{ marginTop: "20px" }}>
                  <Typography variant="body1" color="textSecondary">
                    Register with
                  </Typography>
                </Divider>
                <SecondButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleRegisterGoogle}>
                  <GoogleIcon fontSize="small" sx={{ marginRight: "10px" }} />
                  Google
                </SecondButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Register;
