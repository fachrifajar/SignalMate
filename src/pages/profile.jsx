import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.scss";
import React from "react";
import * as useDb from "@/config/database";
import { auth } from "@/config/firebase";
import { database } from "firebase/database";
import {
  signOut,
  onAuthStateChanged,
  getDatabase,
  ref,
  query,
  equalTo,
} from "firebase/auth";
import { useRouter } from "next/router";
import { updateData } from "@/config/database";
// import { useSelector, useDispatch } from "react-redux";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
// import { deleteAuthData } from "@/store/reducer/auth";
// import * as authRedux from "@/store/reducer/auth";
//MUI

import { styled } from "@mui/material/styles";
import {
  Grid,
  Container,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const MyButton = styled(Button)({
  width: "100px",
  borderRadius: "20px",
  marginTop: "20px",
  background: "#7E98DF",
  color: "white",
  "&:hover": {
    background: "#7E80DF",
    border: "none",
  },
});

const MyTextField = styled(TextField)({
  color: "#7E98DF",
  "&:hover": {
    color: "#7E98DF",
  },
});

export default function Home() {
  const router = useRouter();
  // const store = useSelector((state) => state);
  // console.log("storeee---", store);
  //REDUX
  // const dispatch = useDispatch();

  // let x= (props.profile);
  // console.log(JSON.parse(x))
  const jakartaTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  const [currentUserData, SetCurrentUserData] = React.useState([]);
  const [currentId, setCurrentId] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [allUserData, setAllUserData] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [name, setName] = React.useState("");
  const [profilePict, setProfilePicture] = React.useState("");
  let temp = [];

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setCurrentId(uid);

        useDb.getData(`users`, (snapshot) => {
          const data = snapshot.val();

          const usersArray = Object.keys(data).map((userId) => {
            return { ...data[userId] };
          });
          setAllUserData(usersArray);
          SetCurrentUserData(data[uid]);
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  React.useEffect(() => {
    // const validateAcc = props.profile;

    // if (!validateAcc) {
    //   router.replace("/auth/login");
    // }

    const getData = localStorage.getItem("user");
    const convertData = JSON.parse(getData);

    console.log("convertData....", convertData);

    if (!convertData) {
      router.replace("/auth/login");
    }
  }, []);

  const closeTrigger = () => {
    router.push("/");
  };

  const handleUpdate = () => {
    if (name) {
      const usernameRegex = /^[a-z][a-z0-9\s]{3,30}[a-z0-9]$/;

      if (!usernameRegex.test(name)) {
        setErrorMessage(
          "Name must start with a lowercase letter, contain only letters, numbers, underscores, and spaces, and be between 3-30 characters long."
        );
        setIsError(true);
        console.log(errorMessage);
        return;
      }

      updateData(`/users/${currentUserData.user_id}/fullname`, name)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });

      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          console.log("sukses update nama");
          setSuccess(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (profilePict) {
      updateData(
        `/users/${currentUserData.user_id}/profile_picture`,
        profilePict
      )
        .then(() => {
          window.location.reload();
          setSuccess(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/main-logo.png" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <style>
          {`
            body {
              margin: 0;
              background-color: #FAFAFA;
            }
          `}
        </style>
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
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}>
                  <ArrowBackIosNewIcon
                    sx={{ mr: 1, color: "#7E98DF", cursor: "pointer" }}
                    onClick={closeTrigger}
                  />
                  <span
                    style={{
                      flexGrow: 1,
                      textAlign: "center",
                      color: "#7E98DF",
                      fontWeight: "bold",
                      fontSize: 23,
                      marginRight: "20px",
                    }}>
                    Edit Profile
                  </span>
                </Typography>

                {success && (
                  <Alert
                    severity="success"
                    sx={{ display: "flex", justifyContent: "center" }}>
                    Profile updated successfully!
                  </Alert>
                )}

                {isError ? (
                  <MyTextField
                    error
                    fullWidth
                    id="standard-error-helper-text"
                    label="Fullname"
                    helperText={errorMessage}
                    onChange={(event) => setName(event.target.value)}
                    margin="normal"
                    variant="standard"
                  />
                ) : (
                  <MyTextField
                    id="outlined-helperText"
                    margin="normal"
                    variant="standard"
                    fullWidth
                    label="Fullname"
                    placeholder="John Doe"
                    sx={{ marginTop: "10px" }}
                    onChange={(event) => setName(event.target.value)}
                  />
                )}

                <MyTextField
                  id="outlined-helperText"
                  margin="normal"
                  variant="standard"
                  fullWidth
                  label="Profile Picture"
                  placeholder="Insert your link "
                  sx={{ marginTop: "10px", marginBottom: "20px" }}
                  onChange={(event) => setProfilePicture(event.target.value)}
                />

                <MyButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleUpdate}>
                  Update
                </MyButton>
                {/* {isLoading ? (
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        width: "100px",
                        borderRadius: "20px",
                        marginTop: "20px",
                        background: "#7E98DF",
                        color: "white",
                      }}
                      onClick={addFriendList}>
                      {isLoading ? "Loading..." : "Add"}
                    </LoadingButton>
                  ) : (
                    <MyButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={addFriendList}>
                      Add
                    </MyButton>
                  )} */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
