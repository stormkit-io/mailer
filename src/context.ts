import { createContext } from "react";

interface Context {
  setIsLoggedIn?: (v: boolean) => void;
  accessToken: string | null;
  isLoggedIn: boolean;
}

export default createContext<Context>({
  accessToken: null,
  isLoggedIn: false,
});
