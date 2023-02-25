import { database } from "../config/firebase";
import { onValue, ref, set } from "firebase/database";

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
