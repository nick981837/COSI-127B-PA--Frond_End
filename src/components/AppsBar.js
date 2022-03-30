import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function ButtonAppBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (type) => {
    setAnchorEl(null);
  };

  const handleChange = (type) => {
    props.sendData(type);
    handleClose();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={handleClick} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={() => handleChange("")}>HomePage</MenuItem>
              <MenuItem onClick={() => handleChange("Forest")}>Forest</MenuItem>
              <MenuItem onClick={() => handleChange("Worker")}>Worker</MenuItem>
              <MenuItem onClick={() => handleChange("Sensor")}>Sensor</MenuItem>
              <MenuItem onClick={() => handleChange("Coverage")}>
                Coverage
              </MenuItem>
              <MenuItem onClick={() => handleChange("State")}>State</MenuItem>
              <MenuItem onClick={() => handleChange("Report")}>Report</MenuItem>
            </Menu>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
