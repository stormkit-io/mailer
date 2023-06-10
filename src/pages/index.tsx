import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useTheme } from "@mui/material/styles";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toAddr, setToAddr] = useState("");
  const [error, setError] = useState<string>();
  const theme = useTheme();

  const sendTestEmail = () => {
    setIsLoading(true);
    setError(undefined);

    if (!toAddr || toAddr.indexOf("@") === -1) {
      setIsLoading(false);
      setError(
        "Empty or invalid 'to' field. Provide an email address to send the test email."
      );

      const inputField = document.querySelector(
        "#to-field"
      ) as HTMLInputElement;
      return inputField?.focus();
    }

    fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify({
        email: toAddr,
        templateId: "string",
      }),
    })
      .then(async (res) => {
        console.log(await res.json());
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box
      color="info.main"
      sx={{
        m: "auto",
        maxWidth: "520px",
        width: "100%",
        p: 4,
        bgcolor: "rgba(0,0,0,0.05)",
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Welcome to Mailer
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendTestEmail();
        }}
      >
        <Typography
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            py: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ opacity: 0.5 }} component="span">
            From
          </Typography>{" "}
          {process.env.MAILER_FROM_ADDR}
        </Typography>
        <Box
          sx={{
            pt: 2,
            mb: 2,
          }}
        >
          <TextField
            color="primary"
            variant="filled"
            label="To"
            value={toAddr}
            autoComplete="off"
            autoFocus
            InputProps={{
              sx: { color: theme.palette.info.light },
              id: "to-field",
            }}
            InputLabelProps={{
              color: "info",
              sx: {
                color: theme.palette.info.main,
              },
            }}
            onChange={(e) => setToAddr(e.currentTarget.value)}
            fullWidth
          />
        </Box>
        {error && (
          <Alert color="error" sx={{ mb: 2 }}>
            <AlertTitle>Invalid test address</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" color="secondary" loading={isLoading}>
            Send test email
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Home;
