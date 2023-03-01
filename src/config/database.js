import { database } from "../config/firebase";
import {
  onValue,
  ref,
  set,
  update,
} from "firebase/database";

export const getData = (collection, cb) => {
  const db = database;
  const starCountRef = ref(db, collection);

  return onValue(starCountRef, cb);
};

export const sendData = (table, cb) => {
  const db = database;
  const Ref = ref(db, table);

  return set(Ref, cb);
};

export const updateData = (collection, data) => {
  const db = database;
  const updates = {};
  updates[collection] = data;
  return update(ref(db), updates);
};

