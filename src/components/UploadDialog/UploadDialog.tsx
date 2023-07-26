import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { fetcher } from "~/utils";

interface Props {
  open: boolean;
  file?: File;
  onClose: (numberOfCreatedUsers: number) => void;
}

interface UploadResponse {
  created: User[];
  duplicate: User[];
  total: number;
}

export default function UploadDialog({ open, file, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [importedUsers, setImportedUsers] = useState<User[]>([]);
  const [duplicateUsers, setDuplicateUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!open || !file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetcher("/api/subscriber/upload", {
      method: "POST",
      body: formData,
      contentType: "multipart/form-data",
    })
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as UploadResponse;
          setImportedUsers(data.created);
          setDuplicateUsers(data.duplicate);
          setTotalCount(data.total);
        } else {
          setError("Something went wrong while importing subscribers.");
        }
      })
      .catch(() => {
        setError("Something went wrong while importing subscribers.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [file, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Upload subscribers</DialogTitle>
      <Box sx={{ p: 3, pt: 0, minWidth: "500px" }}>
        {isLoading && <LinearProgress />}
        {!isLoading && !error && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography
              fontSize={14}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                mb: 2,
              }}
            >
              Imported:{" "}
              <Chip
                component="span"
                label={`${importedUsers.length}/${totalCount}`}
              />
            </Typography>
            <Typography
              fontSize={14}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              Duplicate:{" "}
              <Chip
                component="span"
                label={`${duplicateUsers.length}/${totalCount}`}
              />
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: "center" }}>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  onClose(importedUsers.length);
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
        {!isLoading && error && (
          <Alert>
            <AlertTitle>Importing failed</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
      </Box>
    </Dialog>
  );
}
