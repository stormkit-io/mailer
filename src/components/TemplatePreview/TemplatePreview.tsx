import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Button from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface Props {
  children: React.ReactNode;
  onSend: (emails?: string[]) => void;
  onClose: () => void;
  success?: string;
  error?: string;
  isLoading?: boolean;
  isOpen: boolean;
}

export default function TemplatePreview({
  children,
  isLoading,
  isOpen,
  onSend,
  onClose,
  error: errorMessage,
  success: successMessage,
}: Props) {
  const theme = useTheme();
  const [error, setError] = useState<string>();
  const [testEmail, setTestEmail] = useState("");
  const [sendTestEmail, setSendTestEmail] = useState(true);
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const mountNode = contentRef?.contentWindow?.document?.body;

  const focusInput = () => {
    const input = document.querySelector(
      "#send-test-email"
    ) as HTMLInputElement;

    input?.focus();
  };

  useEffect(() => {
    if (isOpen) {
      focusInput();
    }
  }, [isOpen]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.primary.light,
      }}
    >
      <Box
        component="iframe"
        maxWidth="md"
        sx={{
          mt: 2,
          mx: 2,
          flex: 1,
          bgcolor: theme.palette.primary.light,
          border: "1px solid rgba(0,0,0,0.25)",
        }}
        ref={setContentRef}
      >
        {mountNode && (
          <Box>
            {
              <div>
                {createPortal(
                  <Box style={{ padding: 15 }}>{children}</Box>,
                  mountNode
                )}
              </div>
            }
          </Box>
        )}
      </Box>
      <Box
        sx={{
          m: 2,
          borderTop: "1px solid rgba(0,0,0,0.5)",
          bgcolor: "rgba(255,255,255,0.05)",
          pb: 2,
          pt: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ color: "white" }}>
          <Switch
            color="secondary"
            checked={sendTestEmail}
            onChange={(e) => {
              setSendTestEmail(!sendTestEmail);
            }}
          />{" "}
          Send a test email
        </Typography>
        <TextField
          id="send-test-email"
          variant="filled"
          sx={{ mx: 1, flex: 1 }}
          error={!!error}
          value={testEmail}
          disabled={!sendTestEmail}
          autoComplete="off"
          placeholder="test-1@example.org; test-2@example.org"
          label="Test email address"
          onChange={(e) => {
            setTestEmail(e.target.value);
          }}
        />
      </Box>
      {(error || errorMessage) && (
        <Alert sx={{ mx: 2, mb: 2 }} color="error">
          <AlertTitle>Error</AlertTitle>
          {error || errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert sx={{ mx: 2, mb: 2 }} color="success">
          <AlertTitle>Success</AlertTitle>
          {successMessage}
        </Alert>
      )}
      <Box
        sx={{
          flex: 1,
          bgcolor: theme.palette.primary.light,
          color: "white",
          textAlign: "center",
        }}
      >
        <Button
          variant="outlined"
          color="info"
          sx={{ mr: 2 }}
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          loading={isLoading}
          onClick={(e) => {
            e.preventDefault();

            if (sendTestEmail && !testEmail) {
              setError(
                "Specify the emails to send a test email or turn off the Switch."
              );

              focusInput();
            } else {
              setError(undefined);
              onSend(
                testEmail && sendTestEmail
                  ? testEmail.split(";").map((e) => e.trim())
                  : undefined
              );
            }
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
