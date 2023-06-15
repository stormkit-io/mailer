import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";
import TemplateDialog from "~/components/TemplateDialog";
import { useFetchTemplates } from "./templates.actions";

export default function Templates() {
  const { templates, isLoading } = useFetchTemplates();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template>();

  return (
    <Box
      maxWidth="lg"
      sx={{
        m: "auto",
        width: "100%",
        p: 4,
        bgcolor: "rgba(0,0,0,0.05)",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="info.main">
          Templates
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setIsTemplateDialogOpen(true);
            setEditTemplate(undefined);
          }}
        >
          New Template
        </Button>
      </Box>
      {templates.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Templates">
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: "100px", fontWeight: "bold" }}>
                  Template ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Default
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow
                  key={template.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>#{template.recordId}</TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell align="right">
                    <Switch checked={template.isDefault} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : isLoading ? (
        <LinearProgress />
      ) : (
        <Alert color="warning">
          <AlertTitle>You do not have any templates</AlertTitle>
          <Typography>Click New Template to create a new one.</Typography>
        </Alert>
      )}

      <TemplateDialog
        open={isTemplateDialogOpen || Boolean(editTemplate)}
        template={editTemplate}
        onClose={() => {
          setIsTemplateDialogOpen(false);
          setEditTemplate(undefined);
        }}
      />
    </Box>
  );
}
