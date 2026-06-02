import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { NameContext } from "../components/Home";
export default function NavBar() {
  const context = useContext(NameContext);
  const location = useLocation();
  const showSearch = location.pathname === "/";
  if (!context) return;
  const { search, setSearch } = context;
  return (
    <Box>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              LiveEvents
            </Link>
          </Typography>
          {showSearch && (
            <TextField
              id="outlined-basic"
              placeholder="Search"
              variant="outlined"
              sx={{ backgroundColor: "white", width: "30%" }}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          )}
          <Button color="inherit" sx={{ backgroundColor: "rgb(19, 100, 42)" }}>
            <Link
              to="/create"
              style={{ textDecoration: "none", color: "white" }}
            >
              Create Event
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
