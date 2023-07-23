import { createContext, useContext } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "./firebasePhoneAuth";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

  function setRecaptchaVerifier (number) {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  return (
    <userAuthContext.Provider
      value={{ setRecaptchaVerifier }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
