import type { RouteProps } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";
import Layout from "~/components/Layout";
import theme from "./mui-theme";
import Context from "./context";

interface Props {
  routes: RouteProps[];
}

export default function App({ routes }: Props) {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("login") : null;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch("/api/session", { method: "POST", body: JSON.stringify({ token }) })
      .then(async (res) => {
        const data: { ok: boolean } = await res.json();

        if (data.ok) {
          setIsLoggedIn(true);

          if (location.pathname === "/login") {
            navigate("/");
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [location.pathname, token]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoading, isLoggedIn]);

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Context.Provider
          value={{ setIsLoggedIn, isLoggedIn, accessToken: token }}
        >
          <Box
            sx={{
              margin: "auto",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.primary.main,
            }}
          >
            {isLoading && <LinearProgress sx={{ width: 600 }} />}
            {!isLoading && (
              <Layout>
                <Routes>
                  {routes.map((route) => (
                    <Route key={route.path} {...route}></Route>
                  ))}
                </Routes>
              </Layout>
            )}
          </Box>
        </Context.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
