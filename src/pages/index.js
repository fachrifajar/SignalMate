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
import {
  getCookies,
  getCookie,
  setCookie,
  deleteCookie,
  hasCookie,
} from "cookies-next";
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
  useMediaQuery,
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
import { current } from "@reduxjs/toolkit";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { CompareSharp } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isClicked, setIsClicked] = React.useState(false);
  const [active, setActive] = React.useState("All");
  const [keyword, setKeyword] = React.useState("");
  const [currentUserData, SetCurrentUserData] = React.useState([]);
  const [allUserData, setAllUserData] = React.useState(null);
  const [validFriendList, setValidFriendList] = React.useState([]);

  const [currentId, setCurrentId] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [messageList, setMessageList] = React.useState([]);
  const [messageKey, setMessageKey] = React.useState([]);
  const [allMessage, setAllMessage] = React.useState([]);
  const [countNotif, setCountNotif] = React.useState([]);
  const [selectedTimestampId, setSelectedTimestampId] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickWord = (word) => {
    setActive(word);
  };

  let temp = [];
  let temps = [];
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setCurrentId(uid);

        useDb.getData(`users`, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const usersArray = Object.keys(data).map((userId) => {
              return { ...data[userId] };
            });
            setAllUserData(usersArray);
            SetCurrentUserData(data[uid]);
            let targetData = data[uid];

            if (targetData.friend_list) {
              for (let i = 0; i < usersArray.length; i++) {
                for (let j = 0; j < targetData.friend_list.length; j++) {
                  if (usersArray[i].user_id == targetData.friend_list[j]) {
                    temp.push(usersArray[i]);
                    setValidFriendList(temp);
                  }
                }
              }
            } else {
              for (let i = 0; i < usersArray.length; i++) {
                for (let j = 0; j < 1; j++) {
                  if (usersArray[i].user_id == targetData.friend_list[j]) {
                    temp.push(usersArray[i]);
                    setValidFriendList(temp);
                  }
                }
              }
            }
          }
        });

        useDb.getData(`messages/user_test`, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            setMessageList(data);
            setMessageKey(Object.keys(data));

            const messagesArray = Object.keys(data).map((timestamp) => {
              return { ...data[timestamp] };
            });
            setAllMessage(messagesArray);
          }
        });
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  console.log("allMessage---", allMessage);
  console.log("validFriendLIst---", validFriendList);

  var countsNotif = [];

  for (let i = 0; i < allMessage.length; i++) {
    if (
      allMessage[i].is_read == false &&
      allMessage[i].receiver_id.user_id == currentId
    ) {
      countsNotif.push(allMessage[i]);
    }
  }
  // console.log("countNotif",countNotif)
  const notifications = {};

  for (let i = 0; i < countsNotif.length; i++) {
    const item = countsNotif[i];

    if (item.is_read === false) {
      const key = item.senderId;

      if (!notifications[key]) {
        notifications[key] = { notifCount: 1 };
      } else {
        notifications[key].notifCount++;
      }
    }
  }
  const notificationsArray = Object.entries(notifications).map(
    ([key, value]) => ({ id: key, message: value })
  );

  React.useEffect(() => {
    if (selectedChat) {
      var selectedTimestampIds = [];
      for (let i = 0; i < allMessage.length; i++) {
        if (allMessage[i].senderId == selectedChat.user_id) {
          selectedTimestampIds.push(allMessage[i].timestampId);
        }
      }

      // console.log("selectedTimestampIds---", selectedTimestampIds);
      setSelectedTimestampId(selectedTimestampIds);
    }
  }, [selectedChat, allMessage]);

  // console.log(selectedTimestampId);
  console.log("validFriendList---", validFriendList);
  console.log("allMessage--", allMessage);

  const result = {};
  const result2 = {};
  let getLastTime;
  if (validFriendList && allMessage) {
    validFriendList.forEach((friend) => {
      allMessage.forEach((message) => {
        if (
          friend.user_id === message.senderId ||
          friend.user_id === message.receiver_id.user_id
        ) {
          const key = message.receiver_id.user_id;
          if (!result[key]) {
            result[key] = [];
          }
          result[key].push(message.timestamp);
        }
        if (
          friend.user_id === message.senderId ||
          friend.user_id === message.receiver_id.user_id
        ) {
          const key = message.senderId;
          if (!result2[key]) {
            result2[key] = [];
          }
          result2[key].push(message.timestamp);
        }
      });
    });
    // console.log("result--",result)
    // console.log("result2--",result2)

    const combinedObject = Object.assign({}, result, result2);

    for (let key in combinedObject) {
      combinedObject[key] = Array.from(new Set(combinedObject[key])).sort();
    }

    // console.log("combinedObject--",combinedObject)
    getLastTime = Object.keys(combinedObject).map((key) => ({
      id: key,
      value: combinedObject[key].slice(-1)[0],
    }));

    // console.log("getLastTime---", getLastTime);
  }

  // console.log("result---", result);

  const sendMessage = () => {
    useDb.sendData("messages", {
      [`user_test`]: {
        ...messageList,
        [new Date().getTime()]: {
          text: keyword,
          image: "",
          timestamp: jakartaTime,
          receiverPicture: "",
          receiver_id: selectedChat,
          sender: currentUserData.fullname,
          senderPicture: currentUserData.profile_picture,
          senderId: currentUserData.user_id,
          is_read: false,
          timestampId: new Date().getTime(),
        },
      },
    });
    setKeyword("");
  };

  // console.log("selectedChat---", selectedChat);
  // [1677685187818, 1677685684543, 1677685685332, 1677685686587, 1677685687943, 1677685689581]
  const updateNotif = () => {
    console.log("execute0");
    if (selectedTimestampId) {
      console.log("execute");
      selectedTimestampId.forEach((id) => {
        updateData(`/messages/user_test/${id}/is_read`, true)
          .then(() => {
            console.log(`success update notif for ID ${id}`);
          })
          .catch((error) => {
            console.log(`error updating notif for ID ${id}: ${error}`);
          });
      });
    }
  };

  const addFriendTrigger = () => {
    router.push("/add");
  };

  const profileTrigger = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        deleteCookie("profile");
        // dispatch(deleteAuthData());

        updateData(`/users/${currentUserData.user_id}/is_online`, false)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    // const validateAcc = props.profile;

    // if (!validateAcc) {
    //   router.replace("/auth/login");
    // }

    const getData = localStorage.getItem("user");
    const convertData = JSON.parse(getData);

    if (!convertData) {
      router.replace("/auth/login");
    }
  }, []);

  const isXs = useMediaQuery("(max-width: 600px)");

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
      <main>
        <Grid container height="100vh">
          <Grid
            item
            md={3}
            xs={12}
            sx={{
              boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.52)",
              backgroundColor: "#FFFFFF",
              height: "100vh",
              display: isXs && isClicked ? "none" : "block",
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
                  <MenuItem onClick={handleClose && profileTrigger}>
                    <ManageAccountsIcon sx={{ marginRight: "8px" }} />
                    Profile
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>
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
                    </MenuItem> */}
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
                {validFriendList.map((item, key) => {
                  const notification = notificationsArray.find(
                    (n) => n.id === item.user_id
                  );
                  const notifCount = notification
                    ? notification.message.notifCount
                    : 0;

                  const getTime = getLastTime.find(
                    (n) => n.id === item.user_id
                  );

                  return (
                    <Box
                      key={key}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      padding={2}
                      marginTop="20px"
                      onClick={() => {
                        setIsClicked(true);
                        setSelectedChat(item);
                        updateNotif();
                      }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: "pointer" }}>
                        {item.profile_picture !== "null" ? (
                          <img
                            alt="user photo"
                            src={item.profile_picture}
                            style={{
                              width: 56,
                              height: 56,
                              marginRight: "15px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{ width: 56, height: 56, marginRight: 2 }}
                            alt="User Avatar">
                            {item.fullname[0].toUpperCase()}
                          </Avatar>
                        )}

                        <Box>
                          <Typography variant="subtitle1">
                            {item.fullname}
                          </Typography>
                          {item.is_online ? (
                            <Typography
                              sx={{ color: "#7E98DF" }}
                              component="span"
                              variant="body2">
                              Online
                            </Typography>
                          ) : null}
                        </Box>
                      </Box>
                      {notifCount !== 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                          justifyContent="center">
                          {getTime ? (
                            <>
                              <Typography variant="subtitle2">
                                {getTime.value}
                              </Typography>
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
                                {notifCount}
                              </Box>
                            </>
                          ) : (
                            <CircularProgress size={16} thickness={6} />
                          )}
                        </Box>
                      ) : getTime ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-end"
                          justifyContent="center">
                          <Typography variant="subtitle2">
                            {getTime.value}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}

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

          <Grid
            item
            md={9}
            xs={isClicked ? 12 : null}
            sx={{ backgroundColor: "#DADADA" }}>
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
                    {selectedChat.profile_picture !== "null" ? (
                      <Avatar
                        alt="user photo"
                        src={selectedChat.profile_picture}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <Avatar
                        alt={selectedChat.fullname.toUpperCase()}
                        src="/static/images/avatar/1.jpg"
                        sx={{ width: 48, height: 48 }}
                      />
                    )}

                    <div>
                      <Typography variant="subtitle1">
                        {selectedChat.fullname}
                      </Typography>
                      {selectedChat.is_online ? (
                        <Typography
                          sx={{ color: "#7E98DF" }}
                          component="span"
                          variant="body2">
                          Online
                        </Typography>
                      ) : null}
                    </div>
                  </Box>
                </Box>

                {/* Box Chat */}
                <Box px={5} py={3} sx={{ height: "80vh", overflowY: "auto" }}>
                  {/* Left Chat */}
                  {messageKey.map((item, key) => {
                    if (
                      messageList[item].senderId == currentUserData.user_id &&
                      messageList[item].receiver_id.user_id ==
                        selectedChat.user_id
                    ) {
                      return (
                        <Box mb={1} key={key}>
                          <Grid
                            container
                            gap={2}
                            direction="row-reverse"
                            alignItems="flex-end">
                            <Grid item md={2}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  flexDirection: "row",
                                }}>
                                <Box
                                  sx={{
                                    backgroundColor: "#7E98DF",
                                    borderRadius: "35px 35px 10px 35px",
                                    p: 2,
                                    maxWidth: "80vw",
                                    overflow: "hidden",
                                    wordWrap: "break-word",
                                  }}>
                                  <Typography sx={{ color: "#fff" }}>
                                    {messageList[item].text}
                                  </Typography>
                                  &nbsp;
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      flexDirection: "row",
                                    }}>
                                    <Typography sx={{ color: "#fff" }}>
                                      {messageList[item].timestamp}
                                    </Typography>
                                  </Box>
                                </Box>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    }
                    if (
                      messageList[item].senderId == selectedChat.user_id &&
                      messageList[item].receiver_id.user_id ==
                        currentUserData.user_id
                    ) {
                      return (
                        <Box mb={1} key={key}>
                          <Grid container gap={2} alignItems="flex-start">
                            <Grid item md={3}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  flexDirection: "row",
                                }}>
                                <Box
                                  sx={{
                                    backgroundColor: "#fff   ",
                                    borderRadius: "35px 35px 35px 10px",
                                    p: 2,
                                    maxWidth: "80vw",
                                    overflow: "hidden",
                                    wordWrap: "break-word",
                                  }}>
                                  <Typography sx={{ color: "#232323" }}>
                                    {messageList[item].text}
                                  </Typography>
                                  &nbsp;
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      flexDirection: "row",
                                    }}>
                                    <Typography sx={{ color: "#232323" }}>
                                      {messageList[item].timestamp}
                                    </Typography>
                                  </Box>
                                </Box>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    }
                  })}
                </Box>

                {/* Bottom Chat */}
                <Box
                  sx={{
                    backgroundColor: "#6e6e80",
                    // px: 5,
                    // py: 10,
                    position: { xs: "relative", md: "fixed" },
                    bottom: { md: 0, xs: 15 },
                    width: { md: "75%", xs: "100%" },
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
                    onKeyDown={(e) => {
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
    </>
  );
}

// export const getServerSideProps = async (context) => {
//   const profile = getCookie("profile", context) || "";

//   return {
//     props: {
//       profile,
//     },
//   };
// };
