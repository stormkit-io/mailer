import { createContext } from "react";

interface Context {
  setIsLoggedIn?: (v: boolean) => void;
}

export default createContext<Context>({});
