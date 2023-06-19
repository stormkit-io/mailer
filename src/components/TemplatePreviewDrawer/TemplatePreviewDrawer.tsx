import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TemplatePreview from "../TemplatePreview";

interface Props {
  onSend: (emails?: string[]) => void;
  onClose: () => void;
  success?: string;
  error?: string;
  isLoading?: boolean;
  isOpen: boolean;
  html: string;
}

export default function TemplatePreviewDrawer({
  html,
  isOpen,
  onSend,
  onClose,
  error,
  success,
}: Props) {
  const theme = useTheme();

  return (
    <Drawer
      open={isOpen}
      PaperProps={{ sx: { bgcolor: "transparent" } }}
      onClose={onClose}
      anchor="right"
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.dark,
          color: "white",
          width: "600px",
        }}
      >
        <Typography>Preview</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box
        sx={{
          flex: 1,
          fontFamily: "monospace",
        }}
      >
        <TemplatePreview
          isOpen={isOpen}
          error={error}
          success={success}
          onSend={onSend}
          onClose={onClose}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></div>
        </TemplatePreview>
      </Box>
    </Drawer>
  );
}
