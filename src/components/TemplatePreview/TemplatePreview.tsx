import { useState } from "react";
import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import { useTheme } from "@mui/material/styles";

interface Props {
  children: React.ReactNode;
  onSend: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function TemplatePreview({
  children,
  isLoading,
  onSend,
  onClose,
}: Props) {
  const theme = useTheme();
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="iframe"
        maxWidth="md"
        sx={{
          border: "none",
          m: "auto",
          width: "100%",
          bgcolor: theme.palette.primary.light,
        }}
        ref={setContentRef}
      >
        {mountNode ? (
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
        ) : (
          ""
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          bgcolor: theme.palette.primary.light,
          color: "white",
          textAlign: "center",
          p: 2,
          borderTop: "1px solid black",
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
            onSend();
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
