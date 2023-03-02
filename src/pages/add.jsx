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
import { useSelector, useDispatch } from "react-redux";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";
import { deleteAuthData } from "@/store/reducer/auth";
import * as authRedux from "@/store/reducer/auth";
//MUI

import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  TextField,
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

export default function Home(props) {
  const router = useRouter();

  //REDUX
  const dispatch = useDispatch();

  const [currentUserData, SetCurrentUserData] = React.useState([]);
  const [allUserData, setAllUserData] = React.useState(null);
  const [newFriendList, setNewFriendList] = React.useState(null);
  const [findFriend, setFindFriend] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [reqFriends, setReqFriends] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const [validFriendList, setValidFriendList] = React.useState([]);

  let temp = [];

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        useDb.getData(`users`, (snapshot) => {
          const data = snapshot.val();

          const usersArray = Object.keys(data).map((userId) => {
            return { ...data[userId] };
          });
          setAllUserData(usersArray);
          SetCurrentUserData(data[uid]);
          let targetData = data[uid];

          for (let i = 0; i < usersArray.length; i++) {
            for (let j = 0; j < targetData.friend_list.length; j++) {
              if (usersArray[i].user_id == targetData.friend_list[j]) {
                temp.push(usersArray[i]);
                setValidFriendList(temp);
              }
            }
          }
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const closeTrigger = () => {
    router.push("/");
  };

  let targetId;

  const addFriendList = () => {
    setIsLoading(true);

    if (allUserData) {
      for (let i = 0; i < allUserData.length; i++) {
        if (allUserData[i].email == reqFriends) {
          setIsError(false);
          setIsLoading(false);
          setSuccess(true);
          setNewFriendList(allUserData[i].email);

          targetId = allUserData[i].user_id;
        }
      }
      if (newFriendList == null) {
        setIsError(true);
        setErrMsg("User not found!");
        setIsLoading(false);
        setSuccess(false);
      }

      if (reqFriends == currentUserData.email) {
        setIsError(true);
        setErrMsg("Cannot add yourself as a friend");
        setIsLoading(false);
        setSuccess(false);
      }

      let alreadyFriend = 0;
      if (
        currentUserData["friend_list"] !== "null" ||
        currentUserData["friend_list"]
      ) {
        for (let i = 0; i < currentUserData["friend_list"].length; i++) {
          if (currentUserData["friend_list"][i] == targetId) {
            alreadyFriend++;
          }
        }
      }

      if (alreadyFriend > 0) {
        setIsError(true);
        setSuccess(false);
        setErrMsg("User already your friend");
        return;
      }

      if (newFriendList && newFriendList.length > 0) {
        updateFriendList(targetId);
      }
    }
  };

  const updateFriendList = (targetId) => {
    useDb.getData(
      `/users/${currentUserData.user_id}/friend_list`,
      (snapshot) => {
        let currentFriendList = snapshot.val() || [];

        if (reqFriends === currentUserData.email) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        if (!Array.isArray(currentFriendList)) {
          currentFriendList = [];
        }

        if (!currentFriendList.includes(targetId)) {
          currentFriendList.push(targetId);
        }

        updateData(
          `/users/${currentUserData.user_id}/friend_list`,
          currentFriendList
        )
          .then(() => {
            setNewFriendList([]);
            setIsLoading(false);
            setSuccess(true);
            setFindFriend(false);

            updateData(`/users/${targetId}/friend_list`, [
              currentUserData.user_id,
            ]);
          })
          .catch((error) => {
            console.error("Error updating friend list:", error);
            setIsError(true);
            setIsLoading(false);
            setSuccess(false);
          });
      }
    );
  };

  React.useEffect(() => {
    const validateAcc = props.profile;

    if (!validateAcc) {
      router.replace("/auth/login");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Add Friends</title>
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
                    Add Friend
                  </span>
                </Typography>

                {success && (
                  <Alert
                    severity="success"
                    sx={{ display: "flex", justifyContent: "center" }}>
                    Friend added successfully!
                  </Alert>
                )}

                {isError ? (
                  <MyTextField
                    error
                    fullWidth
                    id="standard-error-helper-text"
                    label="By Email*"
                    helperText={errMsg}
                    onChange={(event) => setReqFriends(event.target.value)}
                  />
                ) : (
                  <MyTextField
                    id="outlined-helperText"
                    fullWidth
                    label="By Email*"
                    placeholder="xxx@gmail.com"
                    sx={{ marginTop: "10px", marginBottom: "20px" }}
                    onChange={(event) => setReqFriends(event.target.value)}
                  />
                )}

                <MyButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={addFriendList}>
                  Add
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

export const getServerSideProps = async (context) => {
  const profile = getCookie("profile", context) || "";

  return {
    props: {
      profile,
    },
  };
};
