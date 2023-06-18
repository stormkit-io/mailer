import React from "react";
import Button from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  title?: React.ReactNode;
  message: React.ReactNode;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function Prompt({
  open,
  title = "Confirm action",
  message,
  onConfirm,
  onCancel,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={onConfirm}
          loading={isLoading}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
