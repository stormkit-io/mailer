import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { fetcher } from "~/utils";

interface Props {
  open: boolean;
  file?: File;
  onClose: () => void;
}

export default function UploadDialog({ open, file, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);

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
      .then((response) => {
        console.log(response);
        if (response.ok) {
          // Handle successful upload
          console.log("File uploaded successfully");
        } else {
          // Handle upload error
          console.error("Upload failed");
        }
      })
      .catch((error) => {
        // Handle fetch error
        console.error("Error:", error);
      });
  }, [file, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Uploading subscribers</DialogTitle>
      <Box sx={{ p: 3, pt: 0, minWidth: "500px" }}>
        {isLoading && <LinearProgress />}
      </Box>
    </Dialog>
  );
}
