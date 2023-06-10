import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmail = () => {
    setIsLoading(true);

    fetch("/api/mail", {
      method: "POST",
      body: JSON.stringify({ email: "test@stormkit.io", templateId: "string" }),
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
      sx={{
        m: "auto",
        maxWidth: "520px",
        width: "100%",
        p: 4,
        bgcolor: "rgba(0,0,0,0.05)",
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, textAlign: "center" }}
        color="info.main"
      >
        Welcome to Mailer
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          loading={isLoading}
          onClick={sendTestEmail}
        >
          Send test email
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
