import { database } from "../config/firebase";
import {
  onValue,
  ref,
  set,
  update,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";

export const getData = (collection, cb) => {
  const db = database;
  const starCountRef = ref(db, collection);

  return onValue(starCountRef, cb);
};

export const sendData = (collection, cb) => {
  const db = database;
  const Ref = ref(db, collection);

  return set(Ref, cb);
};

export const updateData = (collection, data) => {
  const db = database;
  const updates = {};
  updates[collection] = data;
  return update(ref(db), updates);
};

// export const getUserByEmail = (userId, email, cb) => {
//   const db = database;
//   const userRef = orderByChild(ref(db, "users"), "user_id");
//   const queryRef = equalTo(userRef, userId);

//   return get(queryRef).then((snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const user = childSnapshot.val();
//       if (user.email === email) {
//         return cb(user);
//       }
//     });
//   });
// };

export const addFriendByEmail = async (userEmail, friendEmail) => {
  const db = database;
  const usersRef = ref(db, "users");

  // Find the userId associated with the userEmail
  let userId;
  await getData(usersRef, (snapshot) => {
    const users = snapshot.val();
    for (const [key, value] of Object.entries(users)) {
      if (value.email === userEmail) {
        userId = key;
        break;
      }
    }
  });

  if (!userId) {
    console.log(`Could not find user with email ${userEmail}`);
    return;
  }

  // Find the friendId associated with the friendEmail
  let friendId;
  await getData(usersRef, (snapshot) => {
    const users = snapshot.val();
    for (const [key, value] of Object.entries(users)) {
      if (value.email === friendEmail) {
        friendId = key;
        break;
      }
    }
  });

  if (!friendId) {
    console.log(`Could not find user with email ${friendEmail}`);
    return;
  }

  // Update the user's friendList with the friendId
  const updates = {};
  updates[`/users/${userId}/friendList/${friendId}`] = true;
  return updateData("", updates);
};
