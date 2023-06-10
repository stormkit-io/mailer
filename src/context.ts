import { createContext } from "react";

interface Context {
  setIsLoggedIn?: (v: boolean) => void;
  accessToken: string | null;
}

export default createContext<Context>({
  accessToken: null,
});
