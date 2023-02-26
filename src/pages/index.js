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
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactsIcon from "@mui/icons-material/Contacts";
import PhoneIcon from "@mui/icons-material/Phone";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import LoadingButton from "@mui/lab/LoadingButton";
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

const WordBox = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: "10px",
  margin: "5px",
  borderRadius: "10px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#7E98DF",
    color: "white",
  },
  "&.active": {
    backgroundColor: "#7E98DF",
    color: "white",
  },
}));

export default function Home() {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isClicked, setIsClicked] = React.useState(false);
  const [active, setActive] = React.useState("All");
  const [keyword, setKeyword] = React.useState("");
  const [currentUserData, SetCurrentUserData] = React.useState([]);
  const [allUserData, setAllUserData] = React.useState(null);
  // console.log(keyword);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickWord = (word) => {
    setActive(word);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        useDb.getData(`users`, (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          const usersArray = Object.keys(data).map((userId) => {
            return { ...data[userId] };
          });
          setAllUserData(usersArray);
          // console.log("CONVERT", usersArray);
          SetCurrentUserData(data[uid]);
          // console.log("DATASNAPSHOT", data[uid]);
          // console.log(data["YNgqY5tBR6PQdavrQRdI1uCfymG3"]);
          // console.log(data[currentId]);
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  console.log("STATEcurrentUserData", currentUserData);
  console.log("STATEallUserData", allUserData);

  const [newFriendList, setNewFriendList] = React.useState(null);

  const [findFriend, setFindFriend] = React.useState(false);
  console.log("findFriend.....", findFriend);

  const addFriendTrigger = () => {
    setFindFriend(true);
  };

  const closeTrigger = () => {
    setFindFriend(false);
  };

  const [reqFriends, setReqFriends] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  console.log(reqFriends);

  const addFriendList = () => {
    setIsLoading(true);
    setSuccess(false);
    let targetId;
    if (allUserData) {
      for (let i = 0; i < allUserData.length; i++) {
        if (allUserData[i].email == reqFriends) {
          setIsError(false);
          setIsLoading(false);
          setSuccess(true);
          setNewFriendList(allUserData[i].email);
          console.log("newFriendList...", newFriendList);
          targetId = allUserData[i].user_id;
          console.log("targetId...", targetId);
        }
      }
      if (newFriendList == null) {
        setIsError(true);
        setIsLoading(false);
        setSuccess(false);
      }
      if (newFriendList && newFriendList.length > 0) {
        updateFriendList(targetId);
      }
    }
  };

  // const updateFriendList = (targetId) => {
  //   updateData(`/users/${currentUserData.user_id}/friendList`, newFriendList)
  //     .then(() => {
  //       console.log("Friend list updated successfully");
  //       setNewFriendList([]);
  //       setIsLoading(false);
  //       setSuccess(true);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating friend list:", error);
  //       setIsError(true);
  //       setIsLoading(false);
  //       setSuccess(false);
  //     });
  // };

  const updateFriendList = (targetId) => {
    // Get the current user's friendList array from the database
    useDb.getData(
      `/users/${currentUserData.user_id}/friend_list`,
      (snapshot) => {
        const currentFriendList = snapshot.val() || [];

        // If the targetId is not already in the friendList, add it
        if (!currentFriendList.includes(targetId)) {
          currentFriendList.push(targetId);
        }

        // Update the friendList array in the database
        updateData(
          `/users/${currentUserData.user_id}/friend_list`,
          currentFriendList
        )
          .then(() => {
            console.log("Friend list updated successfully");
            setNewFriendList([]);
            setIsLoading(false);
            setSuccess(true);
            setFindFriend(false);
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

  // React.useEffect(() => {
  //   let targetId;
  //   if (allUserData) {
  //     for (let i = 0; i < allUserData.length; i++) {
  //       if (allUserData[i].email == "hennyseptiani4@gmail.com") {
  //         setNewFriendList(allUserData[i].email);
  //         targetId = allUserData[i].user_id;
  //         console.log("targetId...", targetId);
  //       }
  //     }
  //   }
  // }, [allUserData]);

  const sendMessage = () => {
    useDb.sendData("messages", {
      message: keyword,
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    const getData = localStorage.getItem("user");
    const convertData = JSON.parse(getData);

    // console.log("convertData....", convertData);

    if (!convertData) {
      router.replace("/auth/login");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
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
      {findFriend ? (
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
                      helperText="User not found!"
                      // variant="standard"
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
      ) : (
        <main>
          <Grid container height="100vh">
            <Grid
              item
              md={3}
              sx={{
                boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.52)",
                backgroundColor: "#FFFFFF",
                height: "100vh",
              }}>
              <Container sx={{ mt: "20px" }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "#7E98DF",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  }}>
                  SignalMate
                  <IconButton
                    aria-label="menu"
                    onClick={handleClick}
                    sx={{ color: "#7E98DF", marginLeft: "auto" }}>
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}>
                    <MenuItem onClick={handleClose && addFriendTrigger}>
                      <PersonAddIcon sx={{ marginRight: "8px" }} />
                      Add Friends
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <PhoneIcon sx={{ marginRight: "8px" }} />
                      Calls
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <ContactsIcon sx={{ marginRight: "8px" }} />
                      Contacts
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <SettingsIcon sx={{ marginRight: "8px" }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleClose && handleLogout}>
                      <LogoutIcon
                        sx={{ marginRight: "8px" }}
                        onClick={handleLogout}
                      />
                      Logout
                    </MenuItem>
                  </Menu>
                </Typography>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "40px",
                  }}>
                  <InputBase
                    placeholder="Type your message..."
                    startAdornment={<SearchIcon />}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      backgroundColor: "#FAFAFA",
                      borderRadius: "20px",
                      height: "40px",
                      maxWidth: "250px",
                      flexGrow: 1,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      color: "#7E98DF",
                      marginLeft: "auto",
                      cursor: "pointer",
                    }}>
                    <AddIcon fontSize="large" />
                  </span>
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    mt: "20px",
                  }}>
                  <WordBox
                    className={active === "All" ? "active" : ""}
                    onClick={() => handleClickWord("All")}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      All
                    </Typography>
                  </WordBox>
                  <WordBox
                    className={active === "Important" ? "active" : ""}
                    onClick={() => handleClickWord("Important")}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Important
                    </Typography>
                  </WordBox>
                  <WordBox
                    className={active === "Unread" ? "active" : ""}
                    onClick={() => handleClickWord("Unread")}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Unread
                    </Typography>
                  </WordBox>
                </Box>

                <div
                  style={{
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    overflowY: "scroll",
                  }}>
                  {[...new Array(15)].map((item, key) => (
                    <Box
                      key={key}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      padding={2}
                      marginTop="20px"
                      onClick={() => setIsClicked(true)}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{ width: 56, height: 56, marginRight: 2 }}
                          alt="User Avatar">
                          J
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">John Doe</Typography>
                          <Typography variant="body2">
                            Lorem ipsum dolor sit amet
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end">
                        <Typography variant="subtitle2">8:30 AM</Typography>
                        <Box
                          sx={{
                            backgroundColor: "#7E98DF",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            marginTop: 1,
                          }}>
                          5
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  <style>
                    {`
                ::-webkit-scrollbar {
                  width: 0.1em;
                }
                ::-webkit-scrollbar-thumb {
                  background-color: rgba(0, 0, 0, 0.2);
                }
              `}
                  </style>
                </div>
              </Container>
            </Grid>

            <Grid item md={9} sx={{ backgroundColor: "#FAFAFA" }}>
              {!isClicked && (
                <Typography
                  sx={{
                    color: "#848484",
                    display: "flex",
                    height: "100vh",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  Please select a chat to start messaging
                </Typography>
              )}

              {isClicked && (
                <React.Fragment>
                  {/* Appbar */}
                  <Box sx={{ backgroundColor: "#fff", px: 5, py: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        alt="Bilkis"
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 48, height: 48 }}
                      />
                      <div>
                        <Typography variant="subtitle1">
                          Theresa Webb
                        </Typography>
                        <Typography
                          sx={{ color: "#7E98DF" }}
                          component="span"
                          variant="body2">
                          Online
                        </Typography>
                      </div>
                    </Box>
                  </Box>

                  {/* Box Chat */}
                  <Box px={5} py={3} sx={{ height: "80vh", overflowY: "auto" }}>
                    {/* Left Chat */}
                    {[...new Array(5)].map((item, key) => (
                      <Box mb={1} key={key}>
                        <Grid container gap={2} alignItems="flex-end">
                          <Grid item>
                            <Avatar
                              alt="Bilkis"
                              src="/static/images/avatar/1.jpg"
                              sx={{ width: 40, height: 40 }}
                            />
                          </Grid>
                          <Grid item md={3}>
                            <Box
                              sx={{
                                backgroundColor: "#7E98DF",
                                borderRadius: "35px 35px 35px 10px",
                                p: 2,
                              }}>
                              <Typography sx={{ color: "#fff" }}>
                                Hi, son, how are you doing? Today, my father and
                                I went to buy a car, bought a cool car.
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    {/* Right Chat */}
                    <Box mb={1} sx={{ my: 5 }}>
                      <Grid
                        container
                        gap={2}
                        direction="row-reverse"
                        alignItems="flex-end">
                        <Grid item>
                          <Avatar
                            alt="Bilkis"
                            src="/static/images/avatar/1.jpg"
                            sx={{ width: 40, height: 40 }}
                          />
                        </Grid>
                        <Grid item md={3}>
                          <Box
                            sx={{
                              backgroundColor: "#fff",
                              borderRadius: "35px 35px 10px 35px",
                              p: 2,
                            }}>
                            <Typography sx={{ color: "#232323" }}>
                              Hi, son, how are you doing? Today, my father and I
                              went to buy a car, bought a cool car.
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Bottom Chat */}
                  <Box
                    sx={{
                      backgroundColor: "#6e6e80",
                      // px: 5,
                      // py: 10,
                      position: "fixed",
                      bottom: 0,
                      width: "75%",
                      borderRadius: "50px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <TextField
                      placeholder="Message"
                      variant="filled"
                      fullWidth
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
                      sx={{ backgroundColor: "#fafafa" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="start"
                            onClick={sendMessage}
                            sx={{ cursor: "pointer" }}>
                            <SendRoundedIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </main>
      )}
    </>
  );
}
