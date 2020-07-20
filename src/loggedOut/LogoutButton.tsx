import React from "react";
import auth from "solid-auth-client";

interface Props {
  onLogout(): void;
  children?: React.ReactElement;
}

const LogoutButton: React.FC<Props> = (props: Props) => {
  const { children, onLogout } = props;
  async function LogoutHandler() {
    auth
      .logout()
      .then(() => {
        onLogout();
      })
      .catch((err) => console.log(err));
  }
  return children ? (
    <div onClick={LogoutHandler}>{children}</div>
  ) : (
    <button onClick={LogoutHandler}>Log Out</button>
  );
};

export default LogoutButton;
