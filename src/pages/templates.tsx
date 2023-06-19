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
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import TrashIcon from "@mui/icons-material/Delete";
import TemplateDialog from "~/components/TemplateDialog";
import Prompt from "~/components/Prompt";
import { useFetchTemplates, deleteTemplate } from "./templates.actions";

export default function Templates() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { templates, isLoading } = useFetchTemplates({ refreshToken });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(); // Gets set after Menu Icon is clicked

  const isMenuOpen = Boolean(anchorEl);

  return (
    <Box
      maxWidth="lg"
      sx={{
        m: "auto",
        width: "100%",
        p: 4,
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
          variant="outlined"
          color="secondary"
          onClick={() => {
            setIsTemplateDialogOpen(true);
            setSelectedTemplate(undefined);
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
                <TableCell sx={{ maxWidth: "120px", fontWeight: "bold" }}>
                  Template ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Default
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow
                  key={template.recordId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>
                    #{template.recordId}
                  </TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell align="right">
                    <Switch checked={Boolean(template.isDefault)} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id={`menu-icon-${template.recordId}`}
                      aria-controls={isMenuOpen ? "long-menu" : undefined}
                      aria-expanded={isMenuOpen ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedTemplate(template);
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
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
        open={isTemplateDialogOpen}
        template={selectedTemplate}
        onSuccess={() => {
          setRefreshToken(Date.now());
          setIsTemplateDialogOpen(false);
          setSelectedTemplate(undefined);
        }}
        onClose={() => {
          setIsTemplateDialogOpen(false);
          setSelectedTemplate(undefined);
        }}
      />

      <Menu
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        open={isMenuOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => {
          setAnchorEl(null);
          setSelectedTemplate(undefined);
        }}
      >
        <MenuItem
          onClick={() => {
            setIsTemplateDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsDeletePromptOpen(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <TrashIcon />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
      <Prompt
        open={isDeletePromptOpen}
        isLoading={isDeletingTemplate}
        onCancel={() => {
          setIsDeletePromptOpen(false);
          setSelectedTemplate(undefined);
        }}
        onConfirm={() => {
          setIsDeletingTemplate(true);
          deleteTemplate({ recordId: selectedTemplate?.recordId! })
            .then((data) => {
              if (data.ok) {
                setIsDeletePromptOpen(false);
                setRefreshToken(Date.now());
              }
            })
            .finally(() => {
              setIsDeletingTemplate(false);
            });
        }}
        message={
          <Box component="span" sx={{ display: "block" }}>
            This will delete the <b>{selectedTemplate?.name}</b> template. Do
            you want to proceed?
          </Box>
        }
      />
    </Box>
  );
}
