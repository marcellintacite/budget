import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { switchFrame } from "./navigation";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const login = async () => {
  const res = await signInWithRedirect(auth, provider);
  switchFrame("dashboard");
};
