import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import * as useDb from "@/config/database";
import Alert from "@mui/material/Alert";
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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";

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
  color: "#7E98DF",
  "&:hover": {
    color: "#7E98DF",
  },
});

const Login = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isErrorEmail, setIsErrorEmail] = React.useState(false);
  const [isErrorPass, setIsErrorPass] = React.useState(false);
  const [errorMsgEmail, setErrorMsgEmail] = React.useState("");
  const [errorMsgPass, setErrorMsgPass] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  const [usersList, setUsersList] = React.useState({});
  const [success, isSuccess] = React.useState(false);

  React.useEffect(() => {
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsersList(data);
      }
    });
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, but has not yet verified their email
            if (!user?.emailVerified) {
              setIsVerified(true);
              console.log("NOT VERIFIED");
            } else {
              const user = userCredential.user;

              useDb.sendData("users", {
                ...usersList,
                [user.uid]: {
                  emailVerified: user.emailVerified,
                  email: user.email,
                  user_id: user.uid,
                  profile_picture: "null",
                  fullname: user.displayName,
                  providerId: "email/pass",
                  created_at:
                    user?.auth?.currentUser?.reloadUserInfo?.createdAt,
                  password:
                    user?.auth?.currentUser?.reloadUserInfo?.passwordHash,
                  is_online: true,
                  friendList: "null",
                },
              });

              setIsVerified(false);
              setIsErrorEmail(false);
              setIsErrorPass(false);
              setIsLoading(true);
              console.log(user);
              console.log(user.emailVerified);

              localStorage.setItem("user", JSON.stringify(user));
              isSuccess(true);
              router.replace("/");
            }
          } else {
            // User is signed out
            // ...
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode == "auth/invalid-email") {
          setIsErrorEmail(true);
          setIsErrorPass(false);
          setErrorMsgEmail("Invalid Email");
        } else if (errorCode == "auth/user-not-found") {
          setIsErrorEmail(true);
          setIsErrorPass(false);
          setErrorMsgEmail("Email not found");
        } else if (errorCode == "auth/wrong-password") {
          setIsErrorPass(true);
          setIsErrorEmail(false);
          setErrorMsgPass("Invalid Password");
        }

        console.log("error,", error);
        console.log("errorCode,", errorCode);
        console.log("errorMessage,", errorMessage);
      });
  };

  const loginGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            ...usersList[user.uid],
            ...{
              is_online: true,
            },
          },
        });

        localStorage.setItem("user", JSON.stringify(user));
        router.replace("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const isDisabled = !email.length || !password.length;

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
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
        <title>Login</title>
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
                  overflowY: "hidden",
                }}>
                {success ? (
                  <Alert
                    severity="success"
                    sx={{ display: "flex", justifyContent: "center" }}>
                    User Verified!
                  </Alert>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "27px",
                    }}>
                    <ArrowBackIosNewIcon
                      sx={{ mr: 1, color: "#7E98DF", cursor: "pointer" }}
                      onClick={handleRegister}
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
                      Login
                    </span>
                  </Typography>
                )}

                {!isVerified ? (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      // color: "#232323",
                      // fontSize: 12,
                      display: "flex",
                      justifyContent: "flex-start",
                      top: 10,
                      position: "relative",
                      marginTop: "10px",
                    }}>
                    Hi, Welcome Back!
                  </Typography>
                ) : (
                  <Alert severity="error">
                    Email Not Verified. Please Verify Your Email to Proceed.
                  </Alert>
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
                    helperText={errorMsgEmail}
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
                    helperText={errorMsgPass}
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

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    color: "#7E98DF",
                    // fontSize: 12,
                    display: "flex",
                    justifyContent: "flex-end",
                    top: 10,
                    position: "relative",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                  onClick={handleForgotPassword}>
                  Forgot Password?
                </Typography>

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
                      onClick={handleLogin}>
                      {isLoading ? "Loading..." : "Login"}
                    </LoadingButton>
                  ) : (
                    <MyButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleLogin}>
                      Login
                    </MyButton>
                  )
                ) : (
                  <MyButton
                    disabled
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}>
                    Login
                  </MyButton>
                )}
                <Divider sx={{ marginTop: "20px" }}>
                  <Typography variant="body1" color="textSecondary">
                    Login with
                  </Typography>
                </Divider>
                <SecondButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={loginGoogle}>
                  <GoogleIcon fontSize="small" sx={{ marginRight: "10px" }} />{" "}
                  Google
                </SecondButton>
                {/* <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    // color: "#7E98DF",
                    // fontSize: 12,
                    display: "flex",
                    justifyContent: "center",
                    top: 15,
                    position: "relative",
                    // marginBottom: "5px",
                  }}>
                  Don’t have an account?{" "}
                  <span style={{ color: "#7E98DF", cursor: "pointer" }}>
                    &nbsp;Sign Up
                  </span>
                </Typography> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Login;
