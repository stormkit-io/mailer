import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import TrashIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function CrudMenu({
  open,
  anchorEl,
  onClose,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <Menu
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onClose={onClose}
    >
      <MenuItem onClick={onEditClick}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <Typography>Edit</Typography>
      </MenuItem>
      <MenuItem onClick={onDeleteClick}>
        <ListItemIcon>
          <TrashIcon />
        </ListItemIcon>
        <Typography>Delete</Typography>
      </MenuItem>
    </Menu>
  );
}
