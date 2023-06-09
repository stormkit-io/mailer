import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        m: "auto",
        maxWidth: "520px",
        width: "100%",
        p: 4,
        bgcolor: "rgba(0,0,0,0.05)",
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }} color="info.main">
        Welcome to Mailer
      </Typography>
    </Box>
  );
};

export default Home;
