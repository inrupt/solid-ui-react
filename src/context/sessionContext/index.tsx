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

import { ILoginInputOptions } from "@inrupt/solid-client-authn-core";

export interface ISessionContext {
  login: (options: ILoginInputOptions) => Promise<void>;
  logout: () => Promise<void>;
  session: Session;
  sessionRequestInProgress: boolean;
  setSessionRequestInProgress?: Dispatch<SetStateAction<boolean>> | any;
  fetch: typeof window.fetch;
}

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
export const unauthenticatedFetch = (url: any, options: any): any => {
  return window.fetch.call(window, url, options);
};

export const buildSession = (sessionId?: string): Session =>
  new Session(
    {
      clientAuthentication: getClientAuthenticationWithDependencies({}),
    },
    sessionId
  );

const defaultSession = buildSession("");
const defaultLogin = defaultSession.login;
const defaultLogout = defaultSession.logout;

export const SessionContext = createContext<ISessionContext>({
  session: defaultSession,
  sessionRequestInProgress: true,
  fetch: unauthenticatedFetch,
  login: defaultLogin,
  logout: defaultLogout,
});

/* eslint react/require-default-props: 0 */
export interface ISessionProvider {
  children: ReactNode;
  sessionId?: string;
  session?: Session;
  sessionRequestInProgress?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Used to provide session data to child components through context, as used by various provided components and the useSession hook.
 */
export const SessionProvider = ({
  sessionId,
  children,
  session: propsSession,
  onError,
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
  const fetch = session.info.isLoggedIn
    ? session.fetch.bind(session)
    : unauthenticatedFetch;

  let currentLocation;

  if (typeof window !== "undefined") {
    currentLocation = window.location;
  }

  useEffect(() => {
    // console.log("handling");
    session
      .handleIncomingRedirect(window.location.href)
      .catch((error) => {
        if (onError) {
          onError(error);
        } else {
          throw error;
        }
      })
      .finally(() => {
        // console.log("done");
        setSessionRequestInProgress(false);
      });

    session.on("logout", () => {
      setSession(buildSession(sessionId));
    });
  }, [session, sessionId, onError, currentLocation]);

  const login = async (options: ILoginInputOptions) => {
    setSessionRequestInProgress(true);

    try {
      await session.login(options);
      setSessionRequestInProgress(false);
    } catch (error) {
      setSessionRequestInProgress(false);

      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await session.logout();
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    }
  };

  return (
    <SessionContext.Provider
      value={{
        login,
        logout,
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
