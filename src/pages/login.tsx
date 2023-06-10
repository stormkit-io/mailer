import { FormEventHandler, useState, useContext, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Context from "../context";

const Home: React.FC = () => {
  const { setIsLoggedIn, isLoggedIn } = useContext(Context);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    return fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      const data: { token?: string } = await res.json();

      if (data.token) {
        localStorage.setItem("login", data.token);
        setIsLoggedIn?.(true);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <Box
      sx={{
        m: "auto",
        maxWidth: "520px",
        width: "100%",
        p: 4,
        bgcolor: "rgba(0,0,0,0.05)",
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }} color="info.main">
        Welcome to Mailer
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            value={username}
            color="primary"
            label="Username"
            variant="filled"
            name="username"
            autoComplete="off"
            InputProps={{
              sx: { color: theme.palette.info.light },
            }}
            InputLabelProps={{
              color: "info",
              sx: {
                color: theme.palette.info.main,
              },
            }}
            onChange={(e) => setUsername(e.currentTarget.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            value={password}
            label="Password"
            variant="filled"
            color="primary"
            name="password"
            type="password"
            autoComplete="off"
            InputProps={{
              sx: { color: theme.palette.info.light },
            }}
            InputLabelProps={{
              color: "info",
              sx: {
                color: theme.palette.info.main,
              },
            }}
            onChange={(e) => setPassword(e.currentTarget.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            type="submit"
          >
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Home;
