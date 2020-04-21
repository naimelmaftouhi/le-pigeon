import React, { useState, useEffect, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import authAPI from "../services/authAPI";

// links
//import RoutesNav from "./RoutesNav";

// Material-ui
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AgentIcon from "@material-ui/icons/EmojiEmotions";
import PowerIcon from "@material-ui/icons/Power";
import AuthContext from "../../contexts/AuthContext";

// icons
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HelpIcon from "@material-ui/icons/Help";

// sass
import "../../assets/sass/_nav.scss";
import "../../assets/sass/nav_avatar.scss";
import userAPI from "../services/userAPI";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  orange: {
    color: "white",
    backgroundColor: "red",
  },
}));

let Nav = ({ history }) => {
  const classes = useStyles();
  // const handleLogin = () => {
  //   props.login();
  // };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogOut = async () => {
    try {
      await authAPI.logout()
      history.replace("/login")
    } catch (error) {
      console.log(error.response);
    }
  }

  // menu avatar  //////

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/login">Se connecter</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/subscribe">S'inscrire</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/board">Mon tableau de bord</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/ask-travel">Mes demandes de voyage</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/destinations">Mes destinations</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/profile">Mon profil</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/add-travel">Ajouter un voyage</Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link to="/profile">Profil voyageur</Link>
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        <Link to="/">Se déconnecter</Link>
      </MenuItem>
    </Menu>
  );

  // menu mobile //////

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="se connecter" color="inherit">
          <PowerIcon />
        </IconButton>
        <p>Se connecter</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="aide" color="inherit">
          <HelpIcon />
        </IconButton>
        <p>Aide</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="devenir agent" color="inherit">
          <AgentIcon />
        </IconButton>
        <p>Devenir Agent</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const { isAuthenticated } = useContext(AuthContext);

  const [currentUser, setCurrentUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    avatar: "",
  });

  const fetchUser = async () => {
    try {
      const { user } = await userAPI.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log({ currentUser });

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          ></IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link to="/" className="navElement">
              LE PIGEON
            </Link>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link to="/help" className="navElement">
              <HelpIcon className="icon" />
            </Link>
            <Link to="/become-agent" className="navElement">
              Devenez agent!
            </Link>
            <Avatar className={classes.orange}>{currentUser.firstName}</Avatar>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            {isAuthenticated ? <p>{currentUser.firstName}</p> : ""}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

const mapStateToAuth = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToAuth = (dispatch) => {
  return {
    login: () => {
      //Dispatch => role: call a action of type ...(SET_AUTH)
      dispatch({ type: "SET_AUTH" });
    },
  };
};

Nav = connect(mapStateToAuth, mapDispatchToAuth)(Nav);
export default Nav;
