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
import { SessionProvider } from "../../src/context/sessionContext";
import { LogoutButton } from "../../src/components/logOut";

export default {
  title: "Authentication/Logout Button",
  component: LogoutButton,
  argTypes: {
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
    },
    onLogout: {
      description: `Function to be called on logout.`,
      action: "onLogout",
    },
  },
};

export function WithChildren({
  onLogout,
  onError,
}: {
  onLogout: () => void;
  onError: (error: Error) => void;
}): ReactElement {
  return (
    <SessionProvider sessionId="log-out-example">
      <p>
        <em>{"Note: "}</em>
        to test out the Authentication examples, you will need to click the
        pop-out icon on the top right to open this example in a new tab first.
      </p>

      <LogoutButton onLogout={onLogout} onError={onError}>
        <Button color="primary">Log Out</Button>
      </LogoutButton>
    </SessionProvider>
  );
}

WithChildren.parameters = {
  controls: { disable: true },
};

export function WithoutChildren({
  onLogout,
  onError,
}: {
  onLogout: () => void;
  onError: (error: Error) => void;
}): ReactElement {
  return (
    <SessionProvider sessionId="log-out-example">
      <p>
        <em>{"Note: "}</em>
        to test out the Authentication examples, you will need to click the
        pop-out icon on the top right to open this example in a new tab first.
      </p>

      <LogoutButton onLogout={onLogout} onError={onError} />
    </SessionProvider>
  );
}

WithoutChildren.parameters = {
  controls: { disable: true },
};
