import React from "react";
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import VideoCallIcon from "@material-ui/icons/VideoCall";

const classes = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));
export default function ContactBox(props) {
  return (
    <div>
      <List className={classes.root}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={props.user.name} src={props.user.avatar} />
          </ListItemAvatar>
          <ListItemText primary={props.user.name} />
          <IconButton
            value={props.user.name}
            aria-label="chat"
            onClick={(e) => props.handleChange(props.user, e)}
            disabled={props.isCaller ? false : true}
            color="primary"
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            aria-label="video"
            onClick={(e) => props.handleCall(props.user, e)}
            disabled={props.isCaller ? false : true}
            color="primary"
          >
            <VideoCallIcon />
          </IconButton>
        </ListItem>
      </List>
    </div>
  );
}
