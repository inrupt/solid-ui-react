/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";
import useSession from "../src/hooks/useSession";
import { SessionProvider } from "../src/context/sessionContext";
import LoginButton from "../src/components/logIn";
import LogoutButton from "../src/components/logOut";

export default {
  title: "Authentication/Session Provider",
  id: "Authentication/Session Provider",
};

export function ProviderWithHook(): ReactElement {
  return (
    <SessionProvider>
      <LoginButton popupUrl="./popup.html">
        <Button color="primary">Log In</Button>
      </LoginButton>
      <LogoutButton>
        <Button color="primary">Log Out</Button>
      </LogoutButton>
      <Dashboard />
    </SessionProvider>
  );
}

function Dashboard() {
  const { session, sessionRequestInProgress } = useSession();
  const sessionRequestText = sessionRequestInProgress
    ? "Session request is in progress"
    : "No session request is in progress";
  return (
    <div>
      <h1>Current Session:</h1>
      <h2>{session?.webId || "logged out"}</h2>
      <h1>Session Request:</h1>
      <h2>{sessionRequestText}</h2>
    </div>
  );
}
