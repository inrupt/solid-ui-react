import React from "react";
import auth from "solid-auth-client";

interface Props {
  onLogout(): void;
  children?: React.ReactElement;
}

const LogoutButton: React.FC<Props> = (props) => {
  async function LogoutHandler() {
    auth.logout().then(() => {
      props.onLogout();
    });
  }
  return props.children ? (
    <div onClick={LogoutHandler}>{props.children}</div>
  ) : (
    <button onClick={LogoutHandler}>Log Out</button>
  );
};

export default LogoutButton;
