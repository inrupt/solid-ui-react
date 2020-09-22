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

import React, {
  createContext,
  ReactElement,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
  ReactNode,
} from "react";

import {
  Session,
  getClientAuthenticationWithDependencies,
} from "@inrupt/solid-client-authn-browser";

export interface ISessionContext {
  session: Session;
  sessionRequestInProgress: boolean;
  setSessionRequestInProgress?: Dispatch<SetStateAction<boolean>> | any;
  fetch: typeof window.fetch;
}

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
export const unauthenticatedFetch = (url: any, options: any): any => {
  return window.fetch.call(window, url, options);
};

export const buildSession = (sessionId: string): Session =>
  new Session(
    {
      clientAuthentication: getClientAuthenticationWithDependencies({}),
    },
    sessionId
  );

const SessionContext = createContext<ISessionContext>({
  session: buildSession(""),
  sessionRequestInProgress: true,
  fetch: unauthenticatedFetch,
});

export default SessionContext;

/* eslint react/require-default-props: 0 */
export interface ISessionProvider {
  children: ReactNode;
  sessionId: string;
  session?: Session;
  sessionRequestInProgress?: boolean;
}

export const SessionProvider = ({
  sessionId,
  children,
  session: propsSession,
  sessionRequestInProgress: defaultSessionRequestInProgress,
}: ISessionProvider): ReactElement => {
  const [session, setSession] = useState<Session>(
    propsSession || buildSession(sessionId)
  );

  const defaultInProgress =
    typeof defaultSessionRequestInProgress === "undefined"
      ? !session.info.isLoggedIn
      : defaultSessionRequestInProgress;

  // If loggedin is true, we're not making a session request.
  const [sessionRequestInProgress, setSessionRequestInProgress] = useState(
    defaultInProgress
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setErrorState] = useState<string | null>();

  const fetch = session.info.isLoggedIn
    ? session.fetch.bind(session)
    : unauthenticatedFetch;

  useEffect(() => {
    // The first time the component is loaded, check for a querystring and
    // attempt to handle it.
    session
      .handleIncomingRedirect(window.location.href)
      .then(() => {
        setSessionRequestInProgress(false);
      })
      .catch((error) => {
        setSessionRequestInProgress(false);
        setErrorState(() => {
          throw error;
        });
      });

    session.on("logout", () => {
      // Workaround for a solid-client-authn bug.
      // It leaves dirty data in localstorage, and doesn't set isLoggedIn to false after logging out.
      window.localStorage.clear();
      setSession(buildSession(sessionId));
    });
  }, [session, sessionId]);

  return (
    <SessionContext.Provider
      value={{
        session,
        sessionRequestInProgress,
        setSessionRequestInProgress,
        fetch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
