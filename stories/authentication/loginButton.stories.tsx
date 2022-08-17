//
// Copyright 2022 Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";
import { SessionProvider } from "../../src/context/sessionContext";
import { LoginButton } from "../../src/components/logIn";

export default {
  title: "Authentication/Login Button",
  component: LoginButton,
  argTypes: {
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
    },
    oidcIssuer: {
      description: `The user's identity provider.`,
    },
    authOptions: {
      description: `Additional options to be passed to [login](https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/classes/_session_.session.html#login).`,
    },
    redirectUrl: {
      description: `The URL to which the user will be redirected after logging in with their identity provider.`,
    },
  },
};

export function WithChildren({
  oidcIssuer,
  onError,
}: {
  oidcIssuer: string;
  onError: (error: Error) => void;
}): ReactElement {
  return (
    <SessionProvider sessionId="log-in-example">
      <p>
        <em>{"Note: "}</em>
        to test out the Authentication examples, you will need to click the
        pop-out icon on the top right to open this example in a new tab first.
      </p>

      <LoginButton
        oidcIssuer={oidcIssuer}
        redirectUrl={window.location.href}
        onError={onError}
      >
        <Button color="primary">Log In</Button>
      </LoginButton>
    </SessionProvider>
  );
}

WithChildren.args = {
  oidcIssuer: "https://inrupt.net",
};

export function WithoutChildren({
  oidcIssuer,
  onError,
}: {
  oidcIssuer: string;
  onError: (error: Error) => void;
}): ReactElement {
  return (
    <SessionProvider sessionId="log-in-example">
      <p>
        <em>{"Note: "}</em>
        to test out the Authentication examples, you will need to click the
        pop-out icon on the top right to open this example in a new tab first.
      </p>

      <LoginButton
        oidcIssuer={oidcIssuer}
        redirectUrl={window.location.href}
        onError={onError}
      />
    </SessionProvider>
  );
}

WithoutChildren.args = {
  oidcIssuer: "https://inrupt.net",
};
