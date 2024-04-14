import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const userRefs = collection(db, "users");
export const getUser = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    return false;
  }
};

export const addUser = async (user) => {
  console.log(user);
  const docRef = doc(userRefs, user.uid);
  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
  await setDoc(docRef, userData);
};

export const addBudgetInBudgetCollection = async (budget) => {
  const budgetRef = await addDoc(collection(db, "budgets"), budget);
  return budgetRef;
};

// ajouter depense
const depenseRefs = collection(db, "depenses");

export const addDepenseInDepenseCollection = async (depense) => {
  const depenseRef = await addDoc(depenseRefs, depense);
  return depenseRef;
};

// snapshot des documents d'une collection budget avec uid d'un user

export const getBudgetsByUser = async (uid) => {
  const q = query(collection(db, "budgets"), where("uid", "==", uid));
  //   snapshot des documents d'une collection budget avec uid d'un user
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getDepenseByBudget = async (budgetId) => {
  const q = query(collection(db, "depenses"), where("budget", "==", budgetId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};
