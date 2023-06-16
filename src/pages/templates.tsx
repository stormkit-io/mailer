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
import TemplateDialog from "~/components/TemplateDialog";
import { useFetchTemplates } from "./templates.actions";

export default function Templates() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { templates, isLoading } = useFetchTemplates({ refreshToken });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template>();

  const handleMenuIconClick: React.MouseEventHandler = (event) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                  key={template.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>
                    #{template.recordId}
                  </TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell align="right">
                    <Switch checked={template.isDefault} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? "long-menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={handleMenuIconClick}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setEditTemplate(template);
                          setIsTemplateDialogOpen(true);
                          setAnchorEl(null);
                        }}
                      >
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        <Typography>Edit</Typography>
                      </MenuItem>
                    </Menu>
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

      {(isTemplateDialogOpen || Boolean(editTemplate)) && (
        <TemplateDialog
          open
          template={editTemplate}
          onSuccess={() => {
            setRefreshToken(Date.now());
            setIsTemplateDialogOpen(false);
            setEditTemplate(undefined);
          }}
          onClose={() => {
            setIsTemplateDialogOpen(false);
            setEditTemplate(undefined);
          }}
        />
      )}
    </Box>
  );
}
