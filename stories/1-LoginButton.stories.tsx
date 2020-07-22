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

import React, { ReactElement, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import auth from "solid-auth-client";
import SessionProviderContext, {
  ISession,
} from "../src/sessionProvider/sessionProviderContext";
import LoginButton from "../src/logIn";

export default {
  title: "Login Button",
  component: LoginButton,
};

export function WithChildren(): ReactElement {
  const [session, setSession] = useState<ISession | undefined>();
  const [sessionRequestInProgress, setSessionRequestInProgress] = useState(
    true
  );

  useEffect(() => {
    setSessionRequestInProgress(true);
    async function fetchSession(): Promise<void> {
      const sessionStorage = await auth.currentSession();
      setSession(sessionStorage);
      setSessionRequestInProgress(false);
    }
    fetchSession().catch((e) => {
      throw e;
    });
  }, [setSession, setSessionRequestInProgress]);

  async function loginTest() {
    console.log("Logged in");
  }
  async function loginFailed(error: Error) {
    console.log("ERROR", error.message);
  }

  return (
    <SessionProviderContext.Provider
      value={{ session, sessionRequestInProgress }}
    >
      <LoginButton
        popupUrl="./popup.html"
        onLogin={() => loginTest()}
        onError={(error) => loginFailed(error)}
      >
        <Button color="primary">Log In</Button>
      </LoginButton>
    </SessionProviderContext.Provider>
  );
}

export function WithoutChildren(): ReactElement {
  async function loginTest() {
    console.log("Logged In");
  }
  async function loginFailed(error: Error) {
    console.log("ERROR", error.message);
  }

  return (
    <LoginButton
      popupUrl="./popup.html"
      onLogin={() => loginTest()}
      onError={(error) => loginFailed(error)}
    />
  );
}
