import { useContext } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import HomeIcon from "@mui/icons-material/Home";
import Context from "~/context";

interface Props {
  children: React.ReactNode;
}

const menu = [
  { text: "Home", path: "/", Icon: HomeIcon },
  { text: "Templates", path: "/templates", Icon: FileCopyIcon },
];

export default function Layout({ children }: Props) {
  const { isLoggedIn } = useContext(Context);
  const location = useLocation();

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
      <Box component="nav" sx={{ bgcolor: "rgba(0,0,0,0.1)", color: "white" }}>
        <Box
          component="ul"
          sx={{ p: 0, borderTop: "1px solid rgba(255,255,255,0.05)" }}
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
                  bgcolor:
                    item.path === location.pathname ? "rgba(0,0,0,0.1)" : "",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  ":hover": { bgcolor: "rgba(255,255,255,0.05)" },
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
      {children}
    </Box>
  );
}
