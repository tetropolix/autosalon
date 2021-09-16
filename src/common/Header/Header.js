import { AppBar, Toolbar } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import classes from "./Header.module.css";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";

export default function Header() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const activeStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
  };

  const links = [
    <NavLink
      exact
      key="/"
      to="/"
      activeStyle={activeStyle}
      className={openDrawer ? classes.DrawerLink : classes.NavLink}
    >
      Cars
    </NavLink>,
    <NavLink
      exact
      key="/addCar"
      to="/addCar"
      activeStyle={activeStyle}
      className={openDrawer ? classes.DrawerLink : classes.NavLink}
    >
      New car
    </NavLink>,
    <NavLink
      exact
      key="/addManu"
      to="/addManu"
      activeStyle={activeStyle}
      className={openDrawer ? classes.DrawerLink : classes.NavLink}
    >
      New manufacturer
    </NavLink>,
  ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar variant="regular">
        <MenuIcon
          onClick={() => setOpenDrawer(true)}
          className={classes.menuIcon}
        />
        <Drawer
          anchor={"left"}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          className={classes.Drawer}
          PaperProps={{ style: { backgroundColor: "rgba(240,240,240)" } }}
        >
          {links.map((link) => {
            return React.cloneElement(link, {
              onClick() {
                setOpenDrawer(false);
              },
            });
          })}
        </Drawer>
        {openDrawer ? null : links}
      </Toolbar>
    </AppBar>
  );
}
