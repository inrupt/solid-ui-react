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

import React, { ReactElement, useContext, useState } from "react";
import {
  SessionContext,
  SessionProvider,
} from "../../src/context/sessionContext";
import { LoginButton } from "../../src/components/logIn";
import { LogoutButton } from "../../src/components/logOut";
import { Text } from "../../src/components/text";
import CombinedDataProvider from "../../src/context/combinedDataContext";

export default {
  title: "Authentication/Session Provider",
  component: SessionProvider,
  parameters: {
    docs: {
      description: {
        component: `Used to provide session data to child components through context, as used by various provided components and the [useSession](/?path=/docs/hooks-usesession) hook.`,
      },
    },
  },
  argTypes: {
    sessionId: {
      description: `A unique id to identify the session`,
      control: { type: null },
    },
    session: {
      description: `An existing [Session](https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/classes/_session_.session.html#class-session) object to be used by the provider.`,
      control: { type: null },
    },
    sessionRequestInProgress: {
      description: `To manually set whether a session request is currently in progress.`,
      control: { type: null },
    },
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
      control: { type: null },
    },
  },
};

export function ProviderWithHook(): ReactElement {
  const [idp, setIdp] = useState("https://inrupt.net");

  const restoreCallback = (url: string) => {
    console.log(`Use this function to navigate back to ${url}`);
  };

  return (
    <SessionProvider
      sessionId="session-provider-example"
      onError={console.log}
      restorePreviousSession
      onSessionRestoreCallback={restoreCallback}
    >
      <p>
        <em>{"Note: "}</em>
        to test out the Authentication examples, you will need to click the
        pop-out icon on the top right to open this example in a new tab first.
      </p>

      <input type="url" value={idp} onChange={(e) => setIdp(e.target.value)} />

      <LoginButton
        oidcIssuer={idp}
        redirectUrl={window.location.href}
        onError={console.log}
      />

      <LogoutButton onError={console.log} />

      <Dashboard />
    </SessionProvider>
  );
}

ProviderWithHook.parameters = {
  actions: { disable: true },
  controls: { disable: true },
};

function Dashboard(): ReactElement {
  const { session, sessionRequestInProgress } = useContext(SessionContext);

  const sessionRequestText = sessionRequestInProgress
    ? "Session request is in progress"
    : "No session request is in progress";

  return (
    <div>
      <h1>Current Session:</h1>
      <h2>{session.info.webId || "logged out"}</h2>

      <h1>Session Request:</h1>
      <h2>{sessionRequestText}</h2>

      {session.info.webId ? (
        <CombinedDataProvider
          datasetUrl={session.info.webId}
          thingUrl={session.info.webId}
        >
          Profile name:
          <Text property="http://www.w3.org/2006/vcard/ns#fn" autosave edit />
        </CombinedDataProvider>
      ) : null}
    </div>
  );
}
