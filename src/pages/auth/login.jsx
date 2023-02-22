import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
                height: "70vh",
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

                <MyTextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
                <MyTextField
                  label="Password"
                  fullWidth
                  margin="normal"
                  variant="standard"
                  type={showPassword ? "text" : "password"}
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
                  }}>
                  Forgot Password?
                </Typography>

                <MyButton variant="contained" color="primary" fullWidth>
                  Login
                </MyButton>
                <Divider sx={{ marginTop: "20px" }}>
                  <Typography variant="body1" color="textSecondary">
                    Login with
                  </Typography>
                </Divider>
                <SecondButton variant="outlined" color="primary" fullWidth>
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
