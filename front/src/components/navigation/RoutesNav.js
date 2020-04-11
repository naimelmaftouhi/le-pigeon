import React from "react";
import {
  // BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import Connect from "../../pages/Connect";
import Help from "../../pages/Help";
import BecomeAgent from "../../pages/BecomeAgent";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Messages from "../../pages/Messages";

// 1 //after created each pages, create paths:
// export to Nav.js

// this function is called only once, before application initially starts to render react-route and any of its related DOM elements
// it can be used to add init config settings to the application

let headers = {
  "Content-Type": "application/json",
  Authorization: ""
};

const compose = (fn, ...rest) =>
  rest.length === 0 ? fn : (...args) => fn(compose(...rest)(...args));

function applyMiddleware(...middlewares) {
  // Middleware handlers are all side-effect,
  // so if we reach the last we don't need to do anything
  const finish = undefined;
  // Middlewares will be called from left to right
  // until one of them doesn't call `next(nextState, transition)`
  console.log(compose);
  const handler = compose(...middlewares);

  return function(nextState, transition) {
    return handler(nextState, transition);
  };
}

// Auth middleware
async function requireAuth(props, next) {
  console.log("ma fonction à moi");
  if (props.token === null) return;
  await function(finish) {
    console.log("await fonction")
    headers.Authorization = props.token;
    axios
      .get("/me", {
        headers: headers
      })
      .then(checkAuth => {
        console.log({ checkAuth: checkAuth });
        if (checkAuth.status == "200") {
          console.log("REDIRECT ON GOING");
          let data = {
            payload: checkAuth.data.user,
            token: props.token
          };
          props.setAuth(data);
          // transition.to('/', null, { redirect: nextState.location });
          // window.location = "/";
          console.log("window location");
          return next();
        }
      })
      .catch(error => console.log(error.response));
    return finish();
  };
  //return next();

  // async function (nextState, transition) {
  // if (!auth.isLoggedIn()) {
  //   transition.to('/login', null, { redirect: nextState.location });
  //   return;
  // }
  // console.log("ma fonction à moi")
  // if (props.token === null) return
  // try {
  //   headers.Authorization = props.token;
  //   const checkAuth = await axios.get("/me", {
  //     headers: headers,
  //   });
  //   console.log({ checkAuth: checkAuth });
  //   if (checkAuth.status == "200") {
  //     console.log("REDIRECT ON GOING");
  //     let data = {
  //       payload: checkAuth.data.user,
  //       token: props.token
  //     }
  //     props.setAuth(data)
  //     // transition.to('/', null, { redirect: nextState.location });
  //     window.location = "/"
  //   }
  // } catch (error) {
  //   console.log(error.response);
  // }

  // next(nextState, transition);
  //};
}

// async function onAppInit(props) {
//   if (props.token === null) return
//   try {
//     headers.Authorization = props.token;
//     const checkAuth = await axios.get("/me", {
//       headers: headers,
//     });
//     console.log({ checkAuth: checkAuth });
//     if (checkAuth.status == "200") {
//       console.log("REDIRECT ON GOING");
//       let data = {
//         payload: checkAuth.data.user,
//         token: props.token
//       }
//       props.setAuth(data)
//       return <Redirect to="/" />;
//     }
//   } catch (error) {
//     console.log(error.response);
//   }
// }

let RoutesNav = props => {
  return (
    <Switch>
      <Route path="/connect">
        <Connect />
      </Route>{" "}
      <Route path="/help">
        <Help />
      </Route>{" "}
      <Route path="/message">
        <Messages />
      </Route>{" "}
      <Route path="/become-agent">
        <BecomeAgent />
      </Route>{" "}
      <Route path="/login" onEnter={applyMiddleware(requireAuth(props))}>
        <Login />
      </Route>{" "}
      <Route path="/">
        <Home />
      </Route>{" "}
    </Switch>
  );
};

const mapStateToAuth = state => {
  return {
    token: state.token,
    auth: state.auth
  };
};

const mapDispatchToAuth = dispatch => {
  return {
    setAuth: data => {
      //Dispatch => role: call a action of type ...(SET_AUTH)
      const action = { type: "SET_AUTH", payload: data };
      dispatch(action);
    }
  };
};

RoutesNav = connect(
  mapStateToAuth,
  mapDispatchToAuth
)(RoutesNav);

export default RoutesNav;
