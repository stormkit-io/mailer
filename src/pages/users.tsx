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
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UserDialog from "~/components/UserDialog";
import Prompt from "~/components/Prompt";
import CrudMenu from "~/components/CrudMenu";
import { useFetchUsers, deleteUser } from "./users.actions";

export default function Users() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { users, isLoading } = useFetchUsers({ refreshToken });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(); // Gets set after Menu Icon is clicked

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
          Subscribers
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setIsUserDialogOpen(true);
            setSelectedUser(undefined);
          }}
        >
          New Subscriber
        </Button>
      </Box>
      {users.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users">
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: "120px", fontWeight: "bold" }}>
                  User ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Full name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Attributes</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const fullName = [user.firstName, user.lastName]
                  .filter((i) => i)
                  .join(" ");

                return (
                  <TableRow
                    key={user.recordId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      #{user.recordId}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{fullName || "-"}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>
                      {JSON.stringify(user.attributes) || "{}"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        id={`menu-icon-${user.recordId}`}
                        aria-controls={isMenuOpen ? "long-menu" : undefined}
                        aria-expanded={isMenuOpen ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedUser(user);
                        }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : isLoading ? (
        <LinearProgress />
      ) : (
        <Alert color="warning">
          <AlertTitle>You do not have any users</AlertTitle>
          <Typography>Click New Template to create a new one.</Typography>
        </Alert>
      )}

      <UserDialog
        open={isUserDialogOpen}
        user={selectedUser}
        onSuccess={() => {
          setRefreshToken(Date.now());
          setIsUserDialogOpen(false);
          setSelectedUser(undefined);
        }}
        onClose={() => {
          setIsUserDialogOpen(false);
          setSelectedUser(undefined);
        }}
      />

      <CrudMenu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={() => {
          setSelectedUser(undefined);
          setAnchorEl(null);
        }}
        onEditClick={() => {
          setIsUserDialogOpen(true);
          setAnchorEl(null);
        }}
        onDeleteClick={() => {
          setIsDeletePromptOpen(true);
          setAnchorEl(null);
        }}
      />

      <Prompt
        open={isDeletePromptOpen}
        isLoading={isDeletingTemplate}
        onCancel={() => {
          setIsDeletePromptOpen(false);
          setSelectedUser(undefined);
        }}
        onConfirm={() => {
          setIsDeletingTemplate(true);
          deleteUser({ recordId: selectedUser?.recordId! })
            .then((data) => {
              console.log(data);
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
            This will delete the user with email <b>{selectedUser?.email}</b>.
            Do you want to proceed?
          </Box>
        }
      />
    </Box>
  );
}
