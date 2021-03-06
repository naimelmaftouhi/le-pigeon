import React, { Component, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import userAPI from "../services/userAPI";
import messageAPI from "../services/messageAPI";
import { GiftedChat } from "react-web-gifted-chat";
import UserChatBox from "./UserChatBox";
import ContactBox from "./ContactBox";
import HomeChatBox from "./HomeChatBox";
import VideoCallerChatBox from "./VideoCallerChatBox";
import VideoReceiverChatBox from "./VideoReceiverChatBox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

var serverConnection;

class ChatBox extends Component {
  //static context = AuthContext;
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.monitorIncomingCalls = this.monitorIncomingCalls.bind(this);
    this.handleStopVideo = this.handleStopVideo.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.setReceiverComponentLoaded = this.setReceiverComponentLoaded.bind(
      this
    );

    this.state = {
      messages: [],
      contacts: [],
      selectedUser: {},
      isAuthenticated: false,
      isSelected: false,
      isCallInitiator: false,
      isCallOnGoing: false,
      isCallAccepted: false,
      isCallStopped: false,
      selectedAvatar: "",
      selectedName: "",
      liveMessage: {},
      liveConnection: {},
      open: true,
      receiverID: null,
      isChatOngoing: false,
      isReceiverComponentLoaded: false,
    };
  }
  handleChange(user, e) {
    this.setState({
      isSelected: true,
      isChatOngoing: true,
      isCallOnGoing: false,
    });
  }

  handleCall(user, e) {
    this.setState({
      isSelected: true,
      isCallInitiator: true,
      isCallOnGoing: true,
      isChatOngoing: false,
    });
  }

  setReceiverComponentLoaded() {
    this.setState({
      isReceiverComponentLoaded: true,
    });
  }
  monitorIncomingCalls() {
    serverConnection = new WebSocket(process.env.REACT_APP_WEB_RTC_SERVER);
    serverConnection.onmessage = (message) => {
      var signal = JSON.parse(message.data);
      //Change state if incoming call for yourself
      if (!signal.chat && signal.receiver === this.state.uuid) {
        this.setState({
          isCallOnGoing: true,
          isSelected: false,
          isChatOngoing: false,
          liveMessage: message,
          liveConnection: serverConnection,
        });
        //Call received for the current user
        const customContext = this.context;
        customContext.setIsCallOnGoing(true);
      }
      if (signal.chat) {
        if (this.props.receiver && signal.receiver === this.state.uuid) {
          this.state.messages.push(signal.chat);
          this.setState({
            receiverID: signal.sender,
            isChatOngoing: true,
            isCallOnGoing: false,
            isSelected: false,
            liveMessage: message,
            liveConnection: serverConnection,
            selectedName:
              this.props.receiver.firstName +
              " " +
              this.props.receiver.lastName,
            selectedAvatar: signal.chat.user.avatar,
          });
        } else if (this.props.user && signal.receiver === this.state.uuid) {
          this.state.messages.push(signal.chat);
          this.setState({
            receiverID: signal.sender,
            isChatOngoing: true,
            isCallOnGoing: false,
            liveMessage: message,
            liveConnection: serverConnection,
            selectedName:
              this.props.user.firstName + " " + this.props.user.lastName,
            selectedAvatar: signal.chat.user.avatar,
          });
        }
      }
    };
  }

  handleClose(e) {
    this.setState({
      isSelected: false,
      isCallInitiator: false,
      isCallOnGoing: false,
      isChatOngoing: false,
    });
  }
  handleStopVideo(e) {
    this.setState({
      isCallOnGoing: false,
      isSelected: false,
      scriptLoaded: true,
    });
  }

  handleOpen(e) {
    this.setState({
      open: false,
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    //this.saveMessage(messages);
    this.sendMessage(messages);
  }

  async saveMessage(messages) {
    const message = {
      senderID: this.state.uuid,
      receiverID: this.state.isSelected
        ? this.state.selectedUser.id
        : this.state.receiverID,
      content: messages[0].text,
      status: "SEND",
    };
    await messageAPI.addMessage(message);
  }

  sendMessage(messages) {
    if (this.state.isSelected && this.state.isChatOngoing) {
      serverConnection.send(
        JSON.stringify({
          chat: messages[0],
          sender: this.state.uuid,
          receiver: this.state.selectedUser.id,
        })
      );
    } else if (!this.state.isSelected && this.state.isChatOngoing) {
      serverConnection.send(
        JSON.stringify({
          chat: messages[0],
          sender: this.state.uuid,
          receiver: this.state.receiverID,
        })
      );
    }
  }

  renderUserChatBox() {
    return (
      <UserChatBox
        handleCall={this.handleCall}
        handleClose={this.handleClose}
        name={this.state.selectedName}
        avatar={this.state.selectedAvatar}
      ></UserChatBox>
    );
  }

  renderContacts() {
    let contact = {};
    const contacts = [];
    if (this.props.user) {
      contact = {
        id: this.props.user.id,
        text: this.props.user.email,
        name: this.props.user.firstName + " " + this.props.user.lastName,
        avatar: this.props.user.avatar,
        isSelected: true,
      };
    } else if (this.props.receiver) {
      contact = {
        id: Math.floor(Math.random()),
        text: "",
        name:
          this.props.receiver.firstName + " " + this.props.receiver.lastName,
        avatar: "",
        isSelected: false,
      };
    }
    if (contact) {
      return (
        <ContactBox
          handleCall={this.handleCall}
          handleChange={this.handleChange}
          user={contact}
          key={contact.id}
          isCaller={this.state.isCallInitiator}
        />
      );
    } else {
      //No parameter during call of ChatBox
      const entries = this.state.contacts.entries();
      for (const [i, item] of entries) {
        contact = {
          id: item.id,
          text: item.content,
          name: item.firstName + " " + item.lastName,
          isSelected: false,
        };
        contacts.push(
          <ContactBox
            handleCall={this.handleCall}
            handleChange={this.handleChange}
            user={contact}
            key={i}
            isCaller={this.state.isCallInitiator}
          />
        );
      }
      return contacts;
    }
  }

  renderHomeChatBox() {
    return <HomeChatBox />;
  }

  renderGiftedChat() {
    return (
      <GiftedChat
        user={this.state.selectedUser}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        inverted="true"
      />
    );
  }

  renderVideoChatBox() {
    return (
      <VideoCallerChatBox
        isCaller={true}
        uuid={this.state.uuid}
        user={this.state.selectedUser}
        handleStopVideo={this.handleStopVideo}
      />
    );
  }

  renderVideoReceiverChatBox() {
    return (
      <VideoReceiverChatBox
        iscaller={false}
        uuid={this.state.uuid}
        liveMessage={this.state.liveMessage}
        liveConnection={this.state.liveConnection}
        handleStopVideo={this.handleStopVideo}
        setReceiverComponentLoaded={this.setReceiverComponentLoaded}
      />
    );
  }

  async componentDidMount() {
    // Connect ot the current context
    const customContext = this.context;
    let msgData = {
      receiverID: customContext.currentUser.id,
    };

    if (this.props.user) {
      this.setState({
        selectedUser: {
          id: this.props.user.id,
          text: this.props.user.email,
          name: this.props.user.firstName + " " + this.props.user.lastName,
          avatar: this.props.user.avatar,
          isSelected: true,
        },
        selectedAvatar: this.props.user.avatar,
        selectedName:
          this.props.user.firstName + " " + this.props.user.lastName,
        isCallInitiator: true,
      });
    } else {
      this.setState({
        //Query the API to retrieve the list of contact
        contacts: await userAPI.getUsers(),
        selectedName:
          this.props.receiver.firstName + " " + this.props.receiver.lastName,
      });
    }

    this.setState({
      //Query the API to retrieve the list of contact
      //contacts: await userAPI.getUsers(),
      //Init UUID
      uuid: customContext.currentUser.id,
      //Init IsAuthenticated
      isAuthenticated: customContext.isAuthenticated,
      //Init Message related to the current user
      //messages: await messageAPI.getMessages(msgData),
    });

    //Monitor incoming calls for the connected user
    this.monitorIncomingCalls(this.state.uuid);
  }

  render() {
    return (
      <div>
        <Dialog fullScreen open={this.state.open} onClose={this.handleOpen}>
          <DialogContent>
            <div className="chat" style={styles.container}>
              <div style={styles.contactList}> {this.renderContacts()} </div>
              {!this.state.isSelected &&
                !this.state.isCallOnGoing &&
                !this.state.isChatOngoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderHomeChatBox()}</div>
                  </div>
                )}
              {this.state.isSelected &&
                this.state.isChatOngoing &&
                !this.state.isCallOngoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderUserChatBox()}</div>
                    <div style={styles.chat}>{this.renderGiftedChat()}</div>
                  </div>
                )}
              {this.state.isSelected &&
                this.state.isCallOnGoing &&
                !this.state.isChatOngoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderUserChatBox()}</div>
                    <div style={styles.chat}>{this.renderVideoChatBox()}</div>
                  </div>
                )}
              {!this.state.isSelected &&
                this.state.isChatOngoing &&
                !this.state.isCallOnGoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderUserChatBox()}</div>
                    <div style={styles.chat}>{this.renderGiftedChat()}</div>
                  </div>
                )}
              {!this.state.isSelected &&
                this.state.isCallOnGoing &&
                this.state.isChatOngoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderUserChatBox()}</div>
                    <div style={styles.chat}>
                      {this.renderVideoReceiverChatBox()}
                    </div>
                    <div style={styles.chat}>{this.renderGiftedChat()}</div>
                  </div>
                )}
              {!this.state.isSelected &&
                this.state.isCallOnGoing &&
                !this.state.isChatOngoing && (
                  <div style={styles.chat}>
                    <div style={styles.chat}>{this.renderUserChatBox()}</div>
                    <div style={styles.chat}>
                      {this.renderVideoReceiverChatBox()}
                    </div>
                  </div>
                )}
              <div style={styles.settings}> </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleOpen} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "auto",
  },
  contactList: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  chat: {
    display: "flex",
    flex: 2,
    flexDirection: "column",
    borderWidth: "0.5px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    height: "200px",
  },
  settings: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
};

export default ChatBox;
