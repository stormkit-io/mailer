import { useContext } from "react";
import { useLocation } from "react-router";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import UserIcon from "@mui/icons-material/Group";
import Context from "~/context";

interface Props {
  children: React.ReactNode;
}

const isDemo = process.env.DEMO;

const menu = [
  { text: "Home", path: "/", Icon: HomeIcon },
  { text: "Templates", path: "/templates", Icon: FileCopyIcon },
  { text: "Subscribers", path: "/subscribers", Icon: UserIcon },
];

export default function Layout({ children }: Props) {
  const { isLoggedIn } = useContext(Context);
  const location = useLocation();
  const theme = useTheme();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        component="nav"
        sx={{ bgcolor: theme.palette.primary.light, color: "white" }}
      >
        <Box
          component="ul"
          sx={{ p: 0, borderTop: "1px solid rgba(200,200,255,0.1)" }}
        >
          {menu.map((item) => (
            <Box
              component="li"
              key={item.text}
              sx={{
                listStyle: "none",
              }}
            >
              <Link
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  pl: 2,
                  pr: 12,
                  opacity: 0.5,
                  bgcolor:
                    item.path === location.pathname ? "rgba(0,0,0,0.25)" : "",
                  borderBottom: `1px solid rgba(200,200,255,0.1)`,
                  ":hover": {
                    bgcolor: "rgba(200,200,255,0.01)",
                    textDecoration: "none",
                    opacity: 1,
                  },
                }}
                href={item.path}
              >
                <item.Icon sx={{ mr: 2 }} />
                {item.text}
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: "100vh" }}>
        {isDemo && (
          <Alert sx={{ m: 2 }} variant="filled" color="warning">
            <Typography>
              You're using the Demo version. This is a <b>read-only</b> mode.
              Your action will not be saved.
            </Typography>
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
}
